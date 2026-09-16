import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { ASSETS } from "../assets";
import Barra from "../components/Barra";
import Carro from "../components/Carro";
import Objeto from "../components/Objeto";

import {
  ESTRELAS,
  META,
  OBSTACULOS,
  type Estrela,
  type Obstaculo,
} from "../jogo/regras";

const BASE_SPEED = 75;
const RIVAL_SPEED = 62;

const BOOST_SPEED = 150;

const DASH_DISTANCE = 140;
const RIVAL_DASH_DISTANCE = 70;

const FINISH = META;

const LANE_TOP = 0;
const LANE_BOTTOM = 1;

export default function Corrida() {
  const params = useLocalSearchParams<{ personagem?: string }>();

  const player = params.personagem === "kuromi" ? "kuromi" : "kitty";

  const rival = player === "kitty" ? "kuromi" : "kitty";

  const { width, height } = useWindowDimensions();

  // =========================================================
  // ESTADOS
  // =========================================================

  const [distance, setDistance] = useState(0);
  const [rivalDistance, setRivalDistance] = useState(0);

  const [count, setCount] = useState("3");
  const [running, setRunning] = useState(false);

  const [jump, setJump] = useState(false);
  const [rivalJump, setRivalJump] = useState(false);

  const [boost, setBoost] = useState(0);
  const [slow, setSlow] = useState(0);

  const [message, setMessage] = useState("");

  // =========================================================
  // DISTÂNCIAS
  // =========================================================

  const distanceRef = useRef(0);
  const rivalDistanceRef = useRef(0);

  // =========================================================
  // MEMÓRIA DO JOGO
  // =========================================================

  const gotStarIds = useRef<Set<number>>(new Set());
  const hitObstacleIds = useRef<Set<number>>(new Set());

  const rivalGotStarIds = useRef<Set<number>>(new Set());
  const rivalHitObstacleIds = useRef<Set<number>>(new Set());

  // Obstáculos que a rival decidiu pular
  const rivalJumpedObstacleIds = useRef<Set<number>>(new Set());

  // Obstáculos que a rival decidiu NÃO pular
  const rivalMissedObstacleIds = useRef<Set<number>>(new Set());

  // =========================================================
  // IA DA RIVAL
  // =========================================================

  const rivalJumpRef = useRef(false);
  const rivalJumpUntil = useRef(0);

  // =========================================================
  // VELOCIDADES / EFEITOS
  // =========================================================

  const boostRef = useRef(0);
  const slowRef = useRef(0);

  const rivalBoostRef = useRef(0);
  const rivalSlowRef = useRef(0);

  // =========================================================
  // DASH
  // =========================================================

  const dashRef = useRef(0);

  // =========================================================
  // FINAL
  // =========================================================

  const finishLock = useRef(false);
  const lastTime = useRef(Date.now());

  // =========================================================
  // TAMANHO
  // =========================================================

  const compact = width < 700 || height < 430;

  const trackWidth = Math.max(560, width);

  const scale = Math.min(1.15, trackWidth / 900);

  // =========================================================
  // POSIÇÃO DAS PISTAS
  // =========================================================

  const laneY = [height * 0.54, height * 0.7];

  // =========================================================
  // OBJETOS
  // =========================================================

  const obstacles = useMemo<Obstaculo[]>(() => OBSTACULOS, []);

  const stars = useMemo<Estrela[]>(() => ESTRELAS, []);

  // =========================================================
  // CONTAGEM REGRESSIVA
  // =========================================================

  useEffect(() => {
    let value = 3;

    setCount("3");
    setRunning(false);

    const timer = setInterval(() => {
      value -= 1;

      if (value > 0) {
        setCount(String(value));
      } else if (value === 0) {
        setCount("VAI!");
      } else {
        clearInterval(timer);

        setCount("");
        setRunning(true);

        lastTime.current = Date.now();
      }
    }, 700);

    return () => clearInterval(timer);
  }, []);

  // =========================================================
  // TECLADO
  // =========================================================

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        pular();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [running, jump]);

  // =========================================================
  // LOOP PRINCIPAL
  // =========================================================

  useEffect(() => {
    if (!running) {
      return;
    }

    let raf = 0;

    const loop = () => {
      const now = Date.now();

      const dt = Math.min(0.05, (now - lastTime.current) / 1000);

      lastTime.current = now;

      // =====================================================
      // EFEITOS DO JOGADOR
      // =====================================================

      boostRef.current = Math.max(0, boostRef.current - dt);

      slowRef.current = Math.max(0, slowRef.current - dt);

      dashRef.current = Math.max(0, dashRef.current - dt);

      // =====================================================
      // EFEITOS DA RIVAL
      // =====================================================

      rivalBoostRef.current = Math.max(0, rivalBoostRef.current - dt);

      rivalSlowRef.current = Math.max(0, rivalSlowRef.current - dt);

      // =====================================================
      // VELOCIDADE DO JOGADOR
      // =====================================================

      let playerSpeed = BASE_SPEED;

      if (boostRef.current > 0) {
        playerSpeed = BOOST_SPEED;
      }

      if (slowRef.current > 0) {
        playerSpeed *= 0.5;
      }

      // =====================================================
      // VELOCIDADE DA RIVAL
      // =====================================================

      let rivalSpeed = RIVAL_SPEED;

      // Pequena variação natural da rival
      const wave = Math.sin(rivalDistanceRef.current / 420);

      rivalSpeed *= 0.98 + wave * 0.04;

      // Estrela da rival
      if (rivalBoostRef.current > 0) {
        rivalSpeed *= 1.55;
      }

      // Obstáculo da rival
      if (rivalSlowRef.current > 0) {
        rivalSpeed *= 0.42;
      }

      // =====================================================
      // DISTÂNCIA DO JOGADOR
      // =====================================================

      const newDistance = Math.min(
        FINISH,
        distanceRef.current + playerSpeed * dt,
      );

      distanceRef.current = newDistance;

      setDistance(newDistance);

      // =====================================================
      // DISTÂNCIA DA RIVAL
      // =====================================================

      const newRivalDistance = Math.min(
        FINISH,
        rivalDistanceRef.current + rivalSpeed * dt,
      );

      rivalDistanceRef.current = newRivalDistance;

      setRivalDistance(newRivalDistance);

      // =====================================================
      // IA DA RIVAL
      // =====================================================

      const agora = Date.now();

      // -----------------------------------------------------
      // TERMINA O PULO
      // -----------------------------------------------------

      if (rivalJumpRef.current && agora >= rivalJumpUntil.current) {
        rivalJumpRef.current = false;

        setRivalJump(false);
      }

      // -----------------------------------------------------
      // PROCURA OBSTÁCULO DA PISTA DE BAIXO
      // -----------------------------------------------------

      const proximoObstaculo = obstacles.find(
        (o) =>
          o.lane === LANE_BOTTOM &&
          !rivalJumpedObstacleIds.current.has(o.id) &&
          !rivalMissedObstacleIds.current.has(o.id) &&
          o.x >= rivalDistanceRef.current &&
          o.x - rivalDistanceRef.current < 145,
      );

      // -----------------------------------------------------
      // DECISÃO DA RIVAL
      // -----------------------------------------------------

      if (proximoObstaculo && !rivalJumpRef.current) {
        /*
         * A rival NÃO pula tudo.
         *
         * IDs ímpares:
         *   → pula
         *
         * IDs pares:
         *   → bate
         *
         * Assim ela realmente interage
         * com os obstáculos.
         */

        const devePular = proximoObstaculo.id % 2 === 1;

        if (devePular) {
          // -----------------------------------------------
          // RIVAL PULA
          // -----------------------------------------------

          rivalJumpedObstacleIds.current.add(proximoObstaculo.id);

          rivalJumpRef.current = true;

          rivalJumpUntil.current = agora + 650;

          setRivalJump(true);
        } else {
          // -----------------------------------------------
          // RIVAL NÃO PULA
          // -----------------------------------------------

          rivalMissedObstacleIds.current.add(proximoObstaculo.id);

          rivalHitObstacleIds.current.add(proximoObstaculo.id);

          // Fica lenta por um tempo
          rivalSlowRef.current = 2.2;
        }
      }

      // =====================================================
      // RIVAL PEGA ESTRELA
      // =====================================================

      const rivalStar = stars.find(
        (s) =>
          s.lane === LANE_BOTTOM &&
          !rivalGotStarIds.current.has(s.id) &&
          Math.abs(s.x - rivalDistanceRef.current) < 42,
      );

      if (rivalStar) {
        rivalGotStarIds.current.add(rivalStar.id);

        // -----------------------------------------------
        // DASH DA RIVAL
        // -----------------------------------------------

        rivalDistanceRef.current = Math.min(
          FINISH,
          rivalDistanceRef.current + RIVAL_DASH_DISTANCE,
        );

        setRivalDistance(rivalDistanceRef.current);

        // -----------------------------------------------
        // BOOST DA RIVAL
        // -----------------------------------------------

        rivalBoostRef.current = 1.2;

        // A estrela cancela a lentidão
        rivalSlowRef.current = 0;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [running, obstacles, stars]);

  // =========================================================
  // COLISÕES / ESTRELAS / FINAL
  // =========================================================

  useEffect(() => {
    if (!running || finishLock.current) {
      return;
    }

    // =======================================================
    // OBSTÁCULO DO JOGADOR
    // =======================================================

    const obstacle = obstacles.find(
      (o) =>
        o.lane === LANE_TOP &&
        !hitObstacleIds.current.has(o.id) &&
        Math.abs(o.x - distance) < 55,
    );

    if (obstacle) {
      hitObstacleIds.current.add(obstacle.id);

      // Se estiver pulando ou no dash,
      // não perde velocidade.
      if (!jump && dashRef.current <= 0) {
        boostRef.current = 0;
        setBoost(0);

        slowRef.current = 2.2;
        setSlow(2.2);

        setMessage("OPS! MAIS DEVAGAR...");

        setTimeout(() => {
          setMessage("");
        }, 900);
      }
    }

    // =======================================================
    // ESTRELA DO JOGADOR
    // =======================================================

    const star = stars.find(
      (s) =>
        s.lane === LANE_TOP &&
        !gotStarIds.current.has(s.id) &&
        Math.abs(s.x - distance) < 38,
    );

    if (star) {
      gotStarIds.current.add(star.id);

      // -----------------------------------------------
      // DASH IMEDIATO
      // -----------------------------------------------

      distanceRef.current = Math.min(
        FINISH,
        distanceRef.current + DASH_DISTANCE,
      );

      setDistance(distanceRef.current);

      dashRef.current = 0.8;

      // Obstáculos já ultrapassados
      obstacles.forEach((o) => {
        if (o.lane === LANE_TOP && o.x <= distanceRef.current + 55) {
          hitObstacleIds.current.add(o.id);
        }
      });

      // -----------------------------------------------
      // BOOST
      // -----------------------------------------------

      boostRef.current = 1.5;
      setBoost(1.5);

      // Cancela lentidão
      slowRef.current = 0;
      setSlow(0);

      setMessage("BOOST! ⭐");

      setTimeout(() => {
        setMessage("");
      }, 900);
    }

    // =======================================================
    // FINAL
    // =======================================================

    if (distanceRef.current >= FINISH || rivalDistanceRef.current >= FINISH) {
      finishLock.current = true;

      const venceu =
        distanceRef.current >= FINISH &&
        distanceRef.current > rivalDistanceRef.current;

      setRunning(false);

      setTimeout(() => {
        router.replace({
          pathname: "/resultado",
          params: {
            venceu: venceu ? "1" : "0",
            player,
          },
        });
      }, 450);
    }
  }, [distance, rivalDistance, jump, running, obstacles, stars, player]);

  // =========================================================
  // PULO DO JOGADOR
  // =========================================================

  function pular() {
    if (!running || jump) {
      return;
    }

    setJump(true);

    setTimeout(() => {
      setJump(false);
    }, 650);
  }

  // =========================================================
  // OBJETOS VISÍVEIS
  // =========================================================

  const visibleObstacles = obstacles.filter((o) => {
    const referenceDistance = o.lane === LANE_TOP ? distance : rivalDistance;

    const relativeX = o.x - referenceDistance;

    return o.x < FINISH && relativeX > -120 && relativeX < 950;
  });

  // =========================================================
  // ESTRELAS VISÍVEIS
  // =========================================================

  const visibleStars = stars.filter((s) => {
    const referenceDistance = s.lane === LANE_TOP ? distance : rivalDistance;

    const collected =
      s.lane === LANE_TOP
        ? gotStarIds.current.has(s.id)
        : rivalGotStarIds.current.has(s.id);

    const relativeX = s.x - referenceDistance;

    return s.x < FINISH && relativeX > -120 && relativeX < 950 && !collected;
  });

  // =========================================================
  // TELA
  // =========================================================

  return (
    <ImageBackground
      source={require("../assets/cenario.png")}
      style={styles.screen}
      resizeMode="cover"
    >
      {/* ===================================================
          HUD
      ==================================================== */}

      <View style={styles.hud}>
        <View style={styles.badge}>
          <Image
            source={player === "kitty" ? ASSETS.kitty : ASSETS.kuromi}
            style={styles.icon}
            resizeMode="contain"
          />

          <Text style={styles.badgeText}>VOCÊ</Text>
        </View>

        <Barra player={distance} rival={rivalDistance} compact={compact} />

        <View
          style={[
            styles.badge,
            {
              backgroundColor: "#eee7ff",
            },
          ]}
        >
          <Image
            source={rival === "kitty" ? ASSETS.kitty : ASSETS.kuromi}
            style={styles.icon}
            resizeMode="contain"
          />

          <Text style={styles.badgeText}>RIVAL</Text>
        </View>
      </View>

      {/* ===================================================
          TÍTULO
      ==================================================== */}

      <Text style={styles.title}>KITTY RUSH! 🎀</Text>

      {/* ===================================================
          PISTA
      ==================================================== */}

      <View
        style={[
          styles.road,
          {
            top: height * 0.5,
            height: height * 0.3,
          },
        ]}
      >
        {/* LINHAS */}

        <View style={styles.laneLineTop} />

        <View style={styles.laneLineBottom} />

        {/* GRAMA */}

        <View style={styles.grassTop} />

        <View style={styles.grassBottom} />

        {/* =================================================
            OBSTÁCULOS
        ================================================= */}

        {visibleObstacles.map((o) => {
          const referenceDistance =
            o.lane === LANE_TOP ? distance : rivalDistance;

          const objectX = (o.x - referenceDistance) * scale + 100;

          const objectY =
            o.lane === LANE_TOP
              ? laneY[0] - height * 0.5
              : laneY[1] - height * 0.5;

          return <Objeto key={o.id} kind={o.kind} x={objectX} y={objectY} />;
        })}

        {/* =================================================
            ESTRELAS
        ================================================= */}

        {visibleStars.map((s) => {
          const referenceDistance =
            s.lane === LANE_TOP ? distance : rivalDistance;

          return (
            <View
              key={s.id}
              style={[
                styles.star,
                {
                  left: (s.x - referenceDistance) * scale + 100,

                  top: s.lane === LANE_TOP ? 18 : 110,
                },
              ]}
            >
              <Image
                source={ASSETS.estrela}
                style={styles.starImg}
                resizeMode="contain"
              />
            </View>
          );
        })}

        {/* =================================================
            CARRO DO JOGADOR
        ================================================= */}

        <Carro
          kind={player}
          x={105}
          y={laneY[0] - height * 0.5 - 34}
          jumping={jump}
        />

        {/* =================================================
            CARRO DA RIVAL
        ================================================= */}

        <Carro
          kind={rival}
          x={105}
          y={laneY[1] - height * 0.5 - 34}
          jumping={rivalJump}
        />

        {/* =================================================
            CHEGADA
        ================================================= */}

        <View
          style={[
            styles.finish,
            {
              left: (FINISH - distance) * scale + 100,
            },
          ]}
        >
          <Image
            source={ASSETS.chegada}
            style={styles.finishImg}
            resizeMode="stretch"
          />
        </View>
      </View>

      {/* ===================================================
          MENSAGENS
      ==================================================== */}

      <View style={styles.messageWrap} pointerEvents="none">
        {count !== "" && <Text style={styles.count}>{count}</Text>}

        {message !== "" && <Text style={styles.message}>{message}</Text>}
      </View>

      {/* ===================================================
          CONTROLES
      ==================================================== */}

      <View style={styles.bottom}>
        <Text style={styles.tip}>
          {Platform.OS === "web"
            ? "SPACE ou ↑ para pular"
            : "Toque em PULAR para desviar"}
        </Text>

        <Pressable
          onPress={pular}
          style={({ pressed }) => [
            styles.jumpButton,
            pressed && styles.jumpButtonPressed,
          ]}
        >
          <Text style={styles.jumpText}>PULAR</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

// ===========================================================
// ESTILOS
// ===========================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },

  hud: {
    position: "absolute",
    zIndex: 20,
    top: 8,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  badge: {
    minWidth: 92,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#ffd8e8",
    borderWidth: 3,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  icon: {
    width: 28,
    height: 28,
  },

  badgeText: {
    fontWeight: "900",
    fontSize: 10,
    color: "#70465b",
    marginLeft: 4,
  },

  title: {
    position: "absolute",
    zIndex: 10,
    top: 48,
    alignSelf: "center",
    fontSize: 26,
    fontWeight: "900",
    color: "#e9406b",
    textShadowColor: "#fff",
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 0,
  },

  road: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#888d91",
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderColor: "#65bb68",
  },

  laneLineTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "33%",
    height: 4,
    backgroundColor: "#f5f2dc",
    opacity: 0.9,
  },

  laneLineBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "66%",
    height: 4,
    backgroundColor: "#f5f2dc",
    opacity: 0.9,
  },

  grassTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -13,
    height: 13,
    backgroundColor: "#76c75e",
  },

  grassBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -13,
    height: 13,
    backgroundColor: "#76c75e",
  },

  star: {
    position: "absolute",
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  starImg: {
    width: 34,
    height: 34,
  },

  finish: {
    position: "absolute",
    top: -3,
    bottom: -3,
    width: 38,
    zIndex: 7,
  },

  finishImg: {
    width: 38,
    height: "100%",
  },

  messageWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "39%",
    alignItems: "center",
    zIndex: 30,
  },

  count: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "#df4770",
    textShadowOffset: {
      width: 3,
      height: 3,
    },
    textShadowRadius: 0,
  },

  message: {
    backgroundColor: "rgba(255,255,255,.92)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    color: "#d6476c",
    fontWeight: "900",
  },

  bottom: {
    position: "absolute",
    zIndex: 40,
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: "center",
  },

  tip: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "800",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,.2)",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },

  jumpButton: {
    backgroundColor: "#ef87a8",
    borderColor: "#fff",
    borderWidth: 3,
    borderRadius: 28,
    paddingVertical: 11,
    paddingHorizontal: 42,
    shadowColor: "#8b5268",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },

  jumpButtonPressed: {
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  jumpText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },
});
