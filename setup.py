from setuptools import setup, find_packages

setup(
    name="rocm-nav",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "typer>=0.9.0",
        "httpx>=0.24.0",
        "rich>=13.0.0"
    ],
    entry_points={
        "console_scripts": [
            "rocm-nav=rocm_nav.main:app",
        ],
    },
)
