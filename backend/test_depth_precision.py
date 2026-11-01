"""Depth import must preserve absolute convergence and sub-byte precision."""
import io
from tempfile import TemporaryDirectory
from unittest.mock import patch
import cv2
import numpy as np
from PIL import Image
import app as backend
from depth_sources import normalise_depth


def main():
    for dtype, maximum in ((np.uint8, 255), (np.uint16, 65535)):
        for raw in (np.full((12,16), maximum//2, dtype=dtype),
                    np.arange(maximum//2, maximum//2+192, dtype=np.int64).reshape(12,16).clip(0,maximum).astype(dtype)):
            expected=raw.astype(np.float32)/maximum
            np.testing.assert_allclose(normalise_depth(raw),expected,atol=1e-7)
    source=io.BytesIO();Image.new('RGB',(16,12),'orange').save(source,'PNG')
    values=np.linspace(.49,.51,192,dtype=np.float32).reshape(12,16)
    with TemporaryDirectory() as directory, patch.object(backend,'SESSION_DATA_FOLDER',directory):
        client=backend.app.test_client()
        source.seek(0);assert client.post('/image',data={'file':(source,'photo.png')}).status_code==200
        for extension,raw in [('npy',values),('png',np.round(values*65535).astype(np.uint16))]:
            data=io.BytesIO()
            if extension=='npy':np.save(data,raw,allow_pickle=False)
            else:data.write(cv2.imencode('.png',raw)[1].tobytes())
            data.seek(0)
            result=client.post('/depth-map/ai-import',data={'file':(data,'depth.'+extension)})
            assert result.status_code==200,result.data
            response=client.get('/depth-map/download?kind=npy');assert response.status_code==200,response.data
            decoded=np.load(io.BytesIO(response.data),allow_pickle=False)
            np.testing.assert_allclose(decoded, values, atol=1/65535)
            assert decoded.max()-decoded.min()<.021,'Narrow map was stretched'
            plane=client.post('/stereo/screen-depth',json={'x':.5,'y':.5})
            assert abs(plane.json['screen_depth']-.5)<1/65535
    print('8/16-bit absolute depth, float32 transport and convergence preservation passed')

if __name__=='__main__':main()
