# Depth-map precision issue

The independent Python API currently min-max normalizes imported grayscale depth maps. This changes the convergence plane and exaggerates small depth differences. It should preserve the absolute normalized values encoded by 8-bit or 16-bit PNG files. Add regression tests for constant-gray and narrow-range maps before releasing.
