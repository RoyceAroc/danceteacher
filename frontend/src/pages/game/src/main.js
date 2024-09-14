import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import * as tf from '@tensorflow/tfjs-core';
import * as posedetection from '@tensorflow-models/pose-detection';
import {STATE} from '../src/params';
import { Camera } from '../src/camera';
import {Renderer} from '../src/renderer';
import testVideo from '../../../../src/assets/media/test.mp4';

let modelType, camera, detector, renderer;

tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
        tfjsWasm.version_wasm}/dist/`);

tf.setBackend('webgl');

async function renderResult() {
    if (camera.video.readyState < 2) {
        await new Promise((resolve) => {
            camera.video.onloadeddata = () => {
                resolve(camera.video);
            };
        });
    }

    let poses = null;

    if (detector != null) {
        try {
            poses = await detector.estimatePoses(
                camera.video,
                {flipHorizontal: false});
        } catch (error) {
          detector.dispose();
          detector = null;
        }
    }

    const rendererParams = [camera.video, poses];

    renderer.draw(rendererParams);

}


export async function startModule() {
    await tf.ready();
    modelType = posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
    const modelConfig = {modelType};

    camera = await Camera.setup(STATE.camera);
    
    detector = await posedetection.createDetector("MoveNet", modelConfig);

    const canvas = document.getElementById('output');

    const isLandscape = camera.video.width > camera.video.height;
    const scaleFactor = isLandscape ? window.innerHeight / camera.video.height : window.innerWidth / camera.video.width;

    canvas.width = camera.video.width * scaleFactor;
    canvas.height = camera.video.height * scaleFactor;

    canvas.style.left = isLandscape ? (window.innerWidth - canvas.width) / 2 + "px" : "";
    canvas.style.top = isLandscape ? "" : (window.innerHeight - canvas.height) / 2 + "px";

    
    renderer = new Renderer(canvas, scaleFactor);
}

export async function renderPrediction() {
    await renderResult();
    let rafId = requestAnimationFrame(renderPrediction);
}


export async function renderUpload(setUploadView) {
    setUploadView(true);
}



export const handleVideoUpload = async (event) => {
  
};


export const loadLocalVideo = async () => {
    const video = document.createElement('video');
    video.src = window.location.origin + testVideo;
    video.crossOrigin = "anonymous";

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    let pose_array = Array.from({length: 17}, () => []);
    const frameRate = 10;
    const frameInterval = 1 / frameRate;

    const playPromise = new Promise((resolve) => {
        video.addEventListener('loadeddata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const totalDuration = video.duration;
            let currentTime = 0;

            const extractFrames = async () => {
                while (currentTime < totalDuration) {
                    video.currentTime = currentTime;
                    await new Promise((resolve) => video.addEventListener('seeked', resolve, {once: true}));

                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    let new_poses = await detector.estimatePoses(canvas, {flipHorizontal: false});
                    if (new_poses.length > 0) {
                        let keypoints = new_poses[0].keypoints;
                        for (let i = 0; i < 17; i++) {
                            pose_array[i].push([keypoints[i].x, keypoints[i].y, keypoints[i].score]);
                        }
                    }
                    currentTime += frameInterval;
                    console.log(currentTime/totalDuration * 100)
                }

                resolve();
            };

            extractFrames();
        });
    });

    await playPromise;
    console.log(pose_array);
};
