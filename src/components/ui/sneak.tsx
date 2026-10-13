"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface SneakProps {
  text?: string;
  className?: string;
  rotationZ?: number;
  fontSize?: number;
  interactiveDistance?: number;
  textColor?: string;
  bgColor?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  letterSpacing?: string;
  cameraDistance?: number;
  fitContainer?: boolean;
}

export const Component = ({
  text = "ABOUT",
  className = "w-full h-[220px]",
  rotationZ = 0,
  fontSize,
  interactiveDistance = 3.2,
  textColor,
  bgColor,
  fontFamily,
  fontWeight,
  letterSpacing,
  cameraDistance = 3.0,
  fitContainer = true
}: SneakProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || sceneInitialized.current) return;
    sceneInitialized.current = true;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 220;

    // === Scene Setup ===
    const scene = new THREE.Scene();
    let aspect = width / height;

    const camera = new THREE.OrthographicCamera(
      -cameraDistance * aspect,
      cameraDistance * aspect,
      cameraDistance,
      -cameraDistance,
      0.01,
      1000
    );
    camera.position.set(0, -10, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear any existing canvas elements first
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(renderer.domElement);

    const detectTheme = () => {
      return document.documentElement.classList.contains("dark") || true;
    };

    const isDark = detectTheme();
    const effectiveTextColor = textColor ?? (isDark ? "#ffffff" : "#000000");
    const effectiveBgColor = bgColor ?? (isDark ? "#0d0d0f" : "#ffffff");
    const effectiveFontFamily = fontFamily ?? "'Playfair Display', Georgia, 'Plus Jakarta Sans', Arial, sans-serif";
    const effectiveFontWeight = fontWeight ?? "900";
    const effectiveLetterSpacing = letterSpacing ?? (text.length > 8 ? "-0.04em" : "0.08em");

    scene.background = new THREE.Color(effectiveBgColor);

    // === Utility: Create Text Texture ===
    function createTextTexture(rawText: string): Promise<THREE.Texture> {
      // Dynamic canvas resolution based on container aspect ratio
      const texW = 2560;
      const texH = Math.round(texW / Math.max(1.8, aspect));
      
      // Auto-scale font size if not explicitly provided
      const effectiveFontSize = fontSize || (rawText.length > 8 ? 360 : 260);

      const svg = `
        <svg width="${texW}" height="${texH}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${effectiveBgColor}"/>
          <text x="50%" y="50%" 
                font-family="${effectiveFontFamily}" 
                font-size="${effectiveFontSize}" 
                font-weight="${effectiveFontWeight}" 
                letter-spacing="${effectiveLetterSpacing}"
                text-anchor="middle" 
                dominant-baseline="central" 
                fill="${effectiveTextColor}">${rawText}</text>
        </svg>
      `;

      const img = new Image();
      const svgBlob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = texW;
          canvas.height = texH;
          const ctx = canvas.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0);
          const texture = new THREE.CanvasTexture(canvas);
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          URL.revokeObjectURL(url);
          resolve(texture);
        };
        img.src = url;
      });
    }

    // === Shader Material ===
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uDisplacement: { value: new THREE.Vector3(1000, 1000, 1000) },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform vec3 uDisplacement;

        float easeInOutCubic(float x) {
          return x < 0.5 ? 4. * x * x * x : 1. - pow(-2. * x + 2., 3.) / 2.;
        }

        float map(float value, float min1, float max1, float min2, float max2) {
          return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
          vUv = uv;
          vec3 new_position = position;

          vec4 localPosition = vec4(position, 1.);
          vec4 worldPosition = modelMatrix * localPosition;

          float dist = length(uDisplacement - worldPosition.xyz);
          float min_distance = ${interactiveDistance.toFixed(1)};

          if (dist < min_distance) {
            float distance_mapped = map(dist, 0., min_distance, 1., 0.);
            float val = easeInOutCubic(distance_mapped) * 1.5;
            new_position.z += val;
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main() {
          vec4 color = texture2D(uTexture, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });

    // Load texture with provided text
    createTextTexture(text).then((texture) => {
      shaderMaterial.uniforms.uTexture.value = texture;
    });

    // === Main text plane dynamically sized to fit frustum ===
    const basePlaneW = fitContainer ? cameraDistance * aspect * 2.02 : 15;
    const basePlaneH = fitContainer ? cameraDistance * 2.02 : 15;
    const geometry = new THREE.PlaneGeometry(basePlaneW, basePlaneH, 120, 80);
    const plane = new THREE.Mesh(geometry, shaderMaterial);
    plane.rotation.z = rotationZ;
    scene.add(plane);

    // === Mouse interaction ===
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerMove(event: PointerEvent) {
      if (!containerRef.current) return;
      const bounds = containerRef.current.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(plane);

      if (intersects.length > 0) {
        shaderMaterial.uniforms.uDisplacement.value.copy(intersects[0].point);
      }
    }

    // === Resize handling ===
    function onWindowResize() {
      if (!containerRef.current) return;
      const curW = containerRef.current.clientWidth || window.innerWidth;
      const curH = containerRef.current.clientHeight || 220;
      aspect = curW / curH;
      camera.left = -cameraDistance * aspect;
      camera.right = cameraDistance * aspect;
      camera.top = cameraDistance;
      camera.bottom = -cameraDistance;
      camera.updateProjectionMatrix();
      renderer.setSize(curW, curH);

      if (fitContainer) {
        const newPlaneW = cameraDistance * aspect * 2.02;
        const newPlaneH = cameraDistance * 2.02;
        plane.scale.set(newPlaneW / basePlaneW, newPlaneH / basePlaneH, 1);
      }
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onWindowResize);

    // === Animation loop ===
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // === Cleanup ===
    return () => {
      cancelAnimationFrame(animationFrameId);
      sceneInitialized.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onWindowResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      shaderMaterial.dispose();
      if (shaderMaterial.uniforms.uTexture.value) {
        (shaderMaterial.uniforms.uTexture.value as THREE.Texture).dispose();
      }
    };
  }, [text, rotationZ, fontSize, interactiveDistance, textColor, bgColor, fontFamily, fontWeight, letterSpacing, cameraDistance, fitContainer]);

  return <div ref={containerRef} className={className} />;
};

export default Component;
