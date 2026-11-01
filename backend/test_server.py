"""Exercise all 17 actual Studio request contracts through Flask, decode outputs."""
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import json
import numpy as np
from PIL import Image
import app as backend


def main():
 catalog=json.loads((Path(__file__).parents[1]/'docs/TECHNIQUE_INVENTORY.json').read_text())
 assert len(catalog['techniques'])==17
 with TemporaryDirectory() as directory, patch.object(backend,'SESSION_DATA_FOLDER',directory):
  client=backend.app.test_client()
  assert client.post('/image').status_code==400
  yy,xx=np.indices((96,160));rgb=np.stack([xx*255//160, yy*255//96, (xx+yy)%256],axis=-1).astype('uint8')
  image=BytesIO();Image.fromarray(rgb).save(image,'PNG');image.seek(0)
  assert client.post('/image',data={'file':(image,'source.png')}).status_code==200
  depth=BytesIO();np.save(depth,(xx/160).astype('float32'));depth.seek(0)
  assert client.post('/depth-map/ai-import',data={'file':(depth,'depth.npy')}).status_code==200
  for technique in catalog['techniques']:
   for scope in ('preview','full'):
    response=client.get(technique[scope])
    assert response.status_code==200,(technique['id'],scope,response.data[:500])
    decoded=Image.open(BytesIO(response.data));decoded.load()
    assert min(decoded.size)>0
    if technique['id'] in ('wiggle','pulfrich'):assert getattr(decoded,'n_frames',1)>1
   print('Integrated technique:',technique['id'])
  for kind in ('gray16','npy','color'):
   r=client.get('/depth-map/download?kind='+kind);assert r.status_code==200,(kind,r.data)
  for path in ('/phantogram/calibration','/lenticular/calibration','/special/phantogram'):
   r=client.get(path);assert r.status_code==200,(path,r.data[:500])
  for action in ({'operation':'adjust','black':.1,'white':.9,'gamma':1.2},{'operation':'undo'},{'operation':'redo'}):
   r=client.post('/depth-map/edit',json=action);assert r.status_code==200,r.data
 print('17 techniques at preview/full scope, animation frames, depth downloads and calibration routes passed')

if __name__=='__main__':main()
