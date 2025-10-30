// src/pages/BattlePage.tsx
import React, { Suspense, useState } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { Sky, PerspectiveCamera } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { BattleHUD } from '../Components/BattleHUD';
import { TextureLoader, RepeatWrapping, Mesh } from 'three';

function BattleUI({ onCardClick }: { onCardClick: () => void }) {
  const cardStyle: React.CSSProperties = {
    width: '150px',
    height: '200px',
    backgroundColor: '#000000ff',
    border: '2px solid #333',
    borderRadius: '10px',
    margin: '0 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease-out',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    color: '#ffffffff',
  };
  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '30px',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  };
  const cards = ['Carta 1', 'Carta 2', 'Carta 3', 'Carta 4', 'Carta 5', 'Carta 6'];
  return (
    <div style={handStyle}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={cardStyle}
          onClick={onCardClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-20px) scale(1.05)';
            e.currentTarget.style.borderColor = 'royalblue';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.borderColor = '#333';
          }}
        >
          {card}
        </div>
      ))}
    </div>
  );
}


function LowPolyTree({ position }: { position: [number, number, number] }) {
  const leavesRef = React.useRef<Mesh | null>(null);
  const randomFactor = React.useMemo(() => Math.random() * 2 + 0.5, []);

 
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!leavesRef.current) return;
    leavesRef.current.rotation.x = Math.sin(time * randomFactor) * 0.1;
    leavesRef.current.rotation.z = Math.cos(time * randomFactor * 0.7) * 0.1;
  });

  return (
    <group position={position}>

      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh ref={leavesRef} castShadow position={[0, 1.5, 0]}>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
}



function TieredStand({ position }: { position: [number, number, number] }) {
  const fieldLength = 45;
  const tierHeight = 2;
  const tierDepth = 3;
  return (
    <group position={position}>
      <mesh position={[0, tierHeight * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[tierDepth, tierHeight, fieldLength]} />
        <meshStandardMaterial color="#b0b0b0" />
      </mesh>
      <mesh position={[tierDepth, tierHeight * 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[tierDepth, tierHeight, fieldLength]} />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>
      <mesh position={[tierDepth * 2, tierHeight * 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[tierDepth, tierHeight, fieldLength]} />
        <meshStandardMaterial color="#909090" />
      </mesh>
    </group>
  );
}

function PlayerBox({ isPlayed }: { isPlayed: boolean }) {
  const initialPos: [number, number, number] = [0, 1.5, 20];
  const centerPos: [number, number, number] = [0, 1.5, 0];
  const { position } = useSpring({
    position: isPlayed ? centerPos : initialPos,
    config: { mass: 1, tension: 200, friction: 20 },
  });
  return (
    <a.mesh position={position} castShadow>
      <boxGeometry args={[2, 3, 2]} />
      <meshStandardMaterial color="royalblue" />
    </a.mesh>
  );
}

function OpponentBox() {
  return (
    <mesh position={[0, 1.5, -20]} castShadow>
      <boxGeometry args={[2, 3, 2]} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  );
}

function FieldLines() {
  const material = <meshBasicMaterial color="white" />;
  const h = 0.01;
  const lineThickness = 0.3;
  const fieldLength = 45;
  const fieldWidth = 30;
  return (
    <group position={[0, h, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fieldWidth, lineThickness]} />{material}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.8, 5, 64]} />{material}
      </mesh>
      <mesh position={[fieldWidth / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[lineThickness, fieldLength]} />{material}
      </mesh>
      <mesh position={[-fieldWidth / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[lineThickness, fieldLength]} />{material}
      </mesh>
      <mesh position={[0, 0, fieldLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fieldWidth, lineThickness]} />{material}
      </mesh>
      <mesh position={[0, 0, -fieldLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fieldWidth, lineThickness]} />{material}
      </mesh>
    </group>
  );
}

function Goal({ position }: { position: [number, number, number] }) {
  const goalWidth = 10;
  const goalHeight = 5;
  const barThickness = 0.4;
  return (
    <group position={position}>
      <mesh position={[0, goalHeight, 0]}>
        <boxGeometry args={[goalWidth, barThickness, barThickness]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-goalWidth / 2, goalHeight / 2, 0]}>
        <boxGeometry args={[barThickness, goalHeight, barThickness]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[goalWidth / 2, goalHeight / 2, 0]}>
        <boxGeometry args={[barThickness, goalHeight, barThickness]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  )
}


function TreeLine({ position, count = 100 }: { position: [number, number, number], count?: number }) {
  const fieldLength = 100;


  const trees = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      key: i,
      position: [
        (Math.random() - 0.5) * 20, 
        0,
        (i / (count - 1)) * fieldLength - (fieldLength / 2) 
      ] as [number, number, number],
    }));
  }, [count, fieldLength]);

  return (
    <group position={position}>
      {trees.map(tree => (
        <LowPolyTree
          key={tree.key}
          position={tree.position}
        />
      ))}
    </group>
  )
}


function StadiumScene({ isCardPlayed }: { isCardPlayed: boolean }) {
  const fieldWidth = 30;
  const standDepth = 9; // Profundidad total de la grada (3 escalones * 3 de prof.)
  const treeLineX = (fieldWidth / 2) + standDepth + 5; // Posición X para la línea de árboles

  const grassTexture = useLoader(TextureLoader, '/textures/grass.jpg');
  
  grassTexture.wrapS = RepeatWrapping;
  grassTexture.wrapT = RepeatWrapping;
  grassTexture.repeat.set(32, 32); // Aumentamos repetición para el plano más grande

  return (
    <>
      {/* Cielo y sol ajustados para la nueva atmósfera */}
      <Sky sunPosition={[100, 20, -80]} />

      {/* Suelo de césped extendido para que no se vean los bordes */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>

      <FieldLines />
      <Goal position={[0, 0, 22.5]} />
      <Goal position={[0, 0, -22.5]} />
      
      <PlayerBox isPlayed={isCardPlayed} />
      <OpponentBox />

      <TieredStand position={[fieldWidth / 2 + 1.5, 0, 0]} />
      <group rotation={[0, Math.PI, 0]}>
        <TieredStand position={[fieldWidth / 2 + 1.5, 0, 0]} />
      </group>

      <TreeLine position={[treeLineX, 0, 0]} count={15} />
      <TreeLine position={[-treeLineX, 0, 0]} count={15} />

      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[40, 50, 30]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}

export function BattlePage() {
  const [isCardPlayed, setCardPlayed] = useState(false);

  const handleCardClick = () => {
    console.log("Carta jugada!");
    setCardPlayed(true);
    
    setTimeout(() => {
      setCardPlayed(false);
    }, 2000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#1a2638' }}>
      <Canvas shadows>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 20, 52]} 
          rotation={[-Math.PI / 9, 0, 0]} 
          fov={60}
          near={1}
          far={1000}
        />
        <fog attach="fog" args={['#1a2638', 40, 160]} />

        <Suspense fallback={null}>
          <StadiumScene isCardPlayed={isCardPlayed} />
        </Suspense>
      </Canvas>
      <BattleUI onCardClick={handleCardClick} />
      <BattleHUD />
    </div>
  );
}