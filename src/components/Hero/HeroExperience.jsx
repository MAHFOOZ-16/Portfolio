import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { HeroBoy } from "./HeroBoy";

const HeroExperience = () => {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight position={[-2, 0, 3]} intensity={3} color={"#FF28D5"} />
      <directionalLight position={[2, 0, 3]} intensity={3} color={"#1C34FF"} />
      <Sparkles count={60} size={5} speed={0.5} color="pink" />
      <group>
        <HeroBoy
          scale={10}
          position={[0, -17, 0]}
        />
      </group>
    </Canvas>
  );
};

export default HeroExperience;
