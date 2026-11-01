"""Independent glue around the owner's post-fork stereo renderer.

The two stereo entry points are preserved from 9ded360238. No upstream
AnaglyphGenerator class, hole filling, singleton or image assets are included.
"""
import numpy as np
from stereo_renderer import render_view


class StereoAdapter:
    def generate_stereo_with_masks(self, image, depth_map_normalised, pop_out=True,
                                   max_disparity_percentage=25, screen_depth=None):
        plane = float(screen_depth) if screen_depth is not None else (0.0 if pop_out else 1.0)
        half_baseline = max_disparity_percentage / 100.0 * image.shape[1] / 2.0
        left, left_mask = render_view(image, depth_map_normalised, half_baseline, plane)
        right, right_mask = render_view(image, depth_map_normalised, -half_baseline, plane)
        return left, right, left_mask, right_mask

    def generate_stereo_images(self, image, depth_map_normalised, pop_out=True,
                               max_disparity_percentage=25, screen_depth=None):
        left, right, _, _ = self.generate_stereo_with_masks(
            image, depth_map_normalised, pop_out, max_disparity_percentage, screen_depth)
        return left, right

    @staticmethod
    def generate_optimised_RR_anaglyph(left, right):
        # Dubois red/cyan linear projection coefficients. Operate in float so
        # negative contributions survive until the final sum; uint8 arithmetic
        # clipped and wrapped contributions in the inherited implementation.
        transform = np.array([
            [.456100, .500484, .176381, -.0434706, -.0879388, -.00155529],
            [-.0400822, -.0378246, -.0157589, .378476, .733640, -.0184503],
            [-.0152161, -.0205971, -.00546856, -.0721527, -.112961, 1.226400],
        ], dtype=np.float32)
        result = np.empty_like(left)
        for y in range(0, left.shape[0], 64):
            rgb = np.concatenate((left[y:y+64, :, ::-1], right[y:y+64, :, ::-1]), axis=2).astype(np.float32)
            result[y:y+64] = np.rint(rgb @ transform.T).clip(0, 255)[..., ::-1].astype(np.uint8)
        return result


stereo_adapter = StereoAdapter()
