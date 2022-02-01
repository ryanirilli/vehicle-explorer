import { Suspense, useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Spinner,
  Heading,
  HStack,
  Icon,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";
import { OrbitControls, useFBX, useCubeTexture } from "@react-three/drei";
import {
  AiFillTwitterCircle,
  AiFillGithub,
  AiFillInstagram,
} from "react-icons/ai";

const rotSpeed = 0.001;

function Content(): JSX.Element {
  const obj = useFBX("/GLS-580.fbx");
  const envMap = useCubeTexture(
    ["front.jpg", "back.jpg", "up.jpg", "down.jpg", "left.jpg", "right.jpg"],
    { path: "/environment/garage/" }
  );

  const bodyMatRef = useRef<THREE.MeshPhongMaterial>();
  const rimMatRef = useRef<THREE.MeshPhongMaterial>();

  const light = useRef();
  const light2 = useRef();
  const light3 = useRef();
  const light4 = useRef();
  const vehicleRef = useRef<THREE.Mesh>();

  const colors = useControls({
    body: { r: 10, b: 13, g: 8 },
    highlight: { r: 29, b: 77, g: 255 },
  });

  const { rotate } = useControls({ rotate: true });

  useFrame(({ camera }) => {
    if (rotate) {
      const { x, z } = camera.position;
      // console.log(camera.position);
      camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
      camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
    }
  });

  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const bodyMat = child.material.find(
            (m: any) => m.name === "Polar_White"
          );
          bodyMatRef.current = bodyMat;
          bodyMat.envMap = envMap;
          bodyMat.reflectivity = 0.4;
          bodyMat.dithering = true;
          bodyMat.shininess = 5;

          const windowsMat = child.material.find(
            (m: any) => m.name === "WindowsTint"
          );
          windowsMat.opacity = 1;

          const rimsMat = child.material.find(
            (m: any) => m.name === "Color_M02"
          );
          rimMatRef.current = rimsMat;
        }
      });
    }
  }, [obj, envMap]);

  useEffect(() => {
    bodyMatRef.current?.color.setRGB(
      colors.body.r / 255,
      colors.body.g / 255,
      colors.body.b / 255
    );
    rimMatRef.current?.color.setRGB(
      colors.highlight.r / 255,
      colors.highlight.g / 255,
      colors.highlight.b / 255
    );
  }, [colors]);

  return (
    <>
      <spotLight
        color="#DCDFF0"
        intensity={0.3}
        ref={light2}
        castShadow={true}
        position={[0, 5, 5]}
        angle={0.6}
        penumbra={1}
        shadowBias={-0.0003}
      />
      <spotLight
        color="#DCDFF0"
        intensity={0.3}
        ref={light}
        castShadow={true}
        position={[0, 15, -5]}
        angle={0.6}
        penumbra={1}
        shadowBias={-0.0003}
      />
      <spotLight
        color="#DCDFF0"
        intensity={0.3}
        ref={light3}
        castShadow={true}
        position={[-10, 10, 0]}
        angle={0.6}
        penumbra={1}
        shadowBias={-0.0003}
      />
      <spotLight
        color="#DCDFF0"
        intensity={0.3}
        ref={light4}
        castShadow={true}
        position={[10, 10, 0]}
        angle={0.6}
        penumbra={1}
        shadowBias={-0.0003}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        target={[0, 1.1, 0]}
      />
      <primitive
        ref={vehicleRef}
        object={obj}
        position={[-1, 0.1, 2.5]}
        scale={[0.02, 0.02, 0.02]}
        rotation={[-1.5708, 0, 0]}
        receiveShadow={true}
        castShadow={true}
      />
      <gridHelper
        args={[60, 60, `#0D0D0D`, `#0D0D0D`]}
        position={[0, 0.1, 0]}
      />
    </>
  );
}

export default function Scene() {
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const camPosition = useBreakpointValue<THREE.Vector3>({
    base: new THREE.Vector3(34, 14, -38),
    md: new THREE.Vector3(-8, 2, 16),
  });

  const fogArgs = useBreakpointValue<any>({
    base: ["black", 45, 65],
    md: ["black", 20, 40],
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <Box h="100vh" w="100vw" bgGradient="radial(gray.900, black)">
      {isMounted ? (
        <Suspense fallback={<Loading />}>
          <Canvas
            shadows
            camera={{
              fov: 15,
              position: camPosition,
              filmGauge: 14,
            }}
          >
            <Content />
            <fog attach="fog" args={fogArgs} />
          </Canvas>
          <Info />
        </Suspense>
      ) : null}
    </Box>
  );
}

function Loading() {
  return (
    <Flex color="white" h="100%" justify="center" align="center">
      <HStack>
        <Spinner speed="0.65s" />
        <Heading size="md">loading...</Heading>
      </HStack>
    </Flex>
  );
}

function Info() {
  return (
    <Box
      color="white"
      position="absolute"
      left={[8, null, 16]}
      bottom={[16, null, 16]}
      zIndex="docked"
    >
      <Heading size="md">
        <strong>Mercedes GLS 580</strong>
      </Heading>

      <Heading size="sm" py={2}>
        @ryanirilli
      </Heading>
      <HStack>
        <Link href="https://github.com/ryanirilli">
          <Icon as={AiFillGithub} boxSize={8} />
        </Link>
        <Link href="https://twitter.com/ryanirilli">
          <Icon as={AiFillTwitterCircle} boxSize={8} />
        </Link>
        <Link href="https://www.instagram.com/ryanirilli/">
          <Icon as={AiFillInstagram} boxSize={8} />
        </Link>
      </HStack>
    </Box>
  );
}
