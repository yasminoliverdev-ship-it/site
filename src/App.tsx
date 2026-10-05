import { useCallback, useEffect, useRef, useState } from "react";
import matheusPhoto from "./matheus.jpg";

type Position = {
  x: number;
  y: number;
};

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2c.4 5.6 4.4 9.6 10 10-5.6.4-9.6 4.4-10 10-.4-5.6-4.4-9.6-10-10 5.6-.4 9.6-4.4 10-10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function App() {
  const [stage, setStage] = useState<"welcome" | "loading" | "invitation">("welcome");
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [noActivated, setNoActivated] = useState(false);
  const [noPosition, setNoPosition] = useState<Position>({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const moveNoButton = useCallback((pointerX?: number, pointerY?: number) => {
    const button = noButtonRef.current;
    const buttonWidth = button?.offsetWidth ?? 88;
    const buttonHeight = button?.offsetHeight ?? 44;
    const padding = 20;
    const maxX = Math.max(window.innerWidth - buttonWidth - padding, padding);
    const maxY = Math.max(window.innerHeight - buttonHeight - padding, padding);
    const yesButton = document.querySelector(".yes-button")?.getBoundingClientRect();

    let x = padding + Math.random() * (maxX - padding);
    let y = padding + Math.random() * (maxY - padding);

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const candidateX = padding + Math.random() * (maxX - padding);
      const candidateY = padding + Math.random() * (maxY - padding);
      const centerX = candidateX + buttonWidth / 2;
      const centerY = candidateY + buttonHeight / 2;
      const farFromPointer =
        pointerX === undefined ||
        pointerY === undefined ||
        Math.hypot(centerX - pointerX, centerY - pointerY) > 170;
      const farFromYes =
        !yesButton ||
        candidateX + buttonWidth < yesButton.left - 24 ||
        candidateX > yesButton.right + 24 ||
        candidateY + buttonHeight < yesButton.top - 24 ||
        candidateY > yesButton.bottom + 24;

      if (farFromPointer && farFromYes) {
        x = candidateX;
        y = candidateY;
        break;
      }
    }

    setNoPosition({ x, y });
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;
    const timer = window.setTimeout(() => setStage("invitation"), 2800);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "invitation" || !isOpen || accepted || !noActivated) return;
    const interval = window.setInterval(() => moveNoButton(), 1100);
    return () => window.clearInterval(interval);
  }, [accepted, isOpen, moveNoButton, noActivated, stage]);

  const handlePagePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!isOpen || accepted || !noActivated) return;
    const noButton = noButtonRef.current;
    if (!noButton) return;

    const rect = noButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (Math.hypot(event.clientX - centerX, event.clientY - centerY) < 145) {
      moveNoButton(event.clientX, event.clientY);
    }
  };

  const activateNoButton = (pointerX: number, pointerY: number) => {
    setNoActivated(true);
    moveNoButton(pointerX, pointerY);
  };

  if (stage === "welcome") {
    return (
      <main className="welcome-page">
        <div className="welcome-glow" />
        <header className="brand welcome-brand">
          <span className="brand-mark"><HeartIcon /></span>
          <span>um convite especial</span>
        </header>

        <section className="welcome-content">
          <div className="portrait-wrap">
            <div className="portrait-outline" />
            <img src={matheusPhoto} alt="Matheus Theodoro sorrindo na praia" />
            <span className="portrait-caption">MATHEUS THEODORO</span>
          </div>
          <div className="welcome-copy">
            <span className="eyebrow">UMA SURPRESA SÓ SUA</span>
            <h1>Isso foi feito<br /><em>especialmente</em><br />para você.</h1>
            <p>
              Tem alguém querendo transformar um simples momento em uma
              lembrança muito bonita.
            </p>
            <button className="start-button" onClick={() => setStage("loading")}>
              Vamos lá
              <span><HeartIcon filled /></span>
            </button>
          </div>
        </section>
        <span className="welcome-note">PREPARADO COM CARINHO</span>
      </main>
    );
  }

  if (stage === "loading") {
    return (
      <main className="loading-page" aria-live="polite">
        <div className="heart-loader">
          {[0, 1, 2, 3, 4].map((heart) => (
            <span key={heart} style={{ "--heart-index": heart } as React.CSSProperties}>
              <HeartIcon filled />
            </span>
          ))}
        </div>
        <span className="loading-kicker">SÓ UM INSTANTE</span>
        <h1>Preparando algo especial...</h1>
        <div className="loading-line"><span /></div>
      </main>
    );
  }

  return (
    <main className="romantic-page" onPointerMove={handlePagePointerMove}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <header className="brand">
        <span className="brand-mark">
          <HeartIcon />
        </span>
        <span>um convite especial</span>
      </header>

      <section className={`experience ${isOpen ? "is-open" : ""}`}>
        <div className="intro">
          <span className="eyebrow">PARA MATHEUS THEODORO</span>
          <h1>Tem uma mensagem<br />esperando por você.</h1>
          <p>Alguns convites merecem um pouco de coragem — e um toque de romance.</p>
        </div>

        <div className="envelope-scene">
          <article className={`letter ${accepted ? "is-accepted" : ""}`}>
            {accepted ? (
              <div className="accepted-message" aria-live="polite">
                <div className="accepted-icon">
                  <HeartIcon filled />
                </div>
                <span className="letter-kicker">VOCÊ DISSE SIM</span>
                <h2>Motivos para sair comigo</h2>
                <p className="reasons-intro">
                  Caso ainda precise de motivos, separei alguns que podem te convencer.
                </p>
                <ol className="reasons-list">
                  <li>
                    <span>01</span>
                    <div>
                      <strong>Risadas garantidas</strong>
                      <small>Uma noite leve, divertida e sem pressa.</small>
                    </div>
                  </li>
                  <li>
                    <span>02</span>
                    <div>
                      <strong>Boa companhia</strong>
                      <small>Conversa boa e toda a atenção só para você.</small>
                    </div>
                  </li>
                  <li>
                    <span>03</span>
                    <div>
                      <strong>Um encontro com carinho</strong>
                      <small>Cada detalhe pensado para ser especial.</small>
                    </div>
                  </li>
                </ol>
                <span className="accepted-closing">Agora só falta escolher o dia.</span>
              </div>
            ) : (
              <div className="letter-content">
                <div className="letter-topline">
                  <span>UM CONVITE PARA</span>
                  <span className="tiny-heart"><HeartIcon filled /></span>
                </div>
                <h2>Matheus Theodoro,</h2>
                <p className="letter-copy">
                  Entre tantos lugares e tantas pessoas, eu escolheria dividir
                  um momento especial com você. Uma conversa sem pressa, algumas
                  risadas e uma noite para lembrar.
                </p>
                <p className="question">Aceita sair comigo?</p>

                <div className="choice-area">
                  <button className="yes-button" onClick={() => setAccepted(true)}>
                    <HeartIcon filled />
                    Sim, eu adoraria
                  </button>
                  {!noActivated && (
                    <button
                      className="no-button is-idle"
                      ref={noButtonRef}
                      aria-label="Não — mas este botão sempre foge"
                      onPointerEnter={(event) => activateNoButton(event.clientX, event.clientY)}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        activateNoButton(event.clientX, event.clientY);
                      }}
                      tabIndex={-1}
                    >
                      Não
                    </button>
                  )}
                </div>
                <span className="hint">Dica: algumas escolhas são mais fáceis que outras.</span>
              </div>
            )}
          </article>

          <button
            className="envelope"
            aria-label={isOpen ? "Carta aberta" : "Abrir o envelope"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
          >
            <span className="envelope-back" />
            <span className="envelope-letter-preview">
              <span>para você</span>
            </span>
            <span className="envelope-front-left" />
            <span className="envelope-front-right" />
            <span className="envelope-front-bottom" />
            <span className="envelope-flap" />
            <span className="wax-seal">
              <HeartIcon filled />
            </span>
          </button>

          {!isOpen && (
            <button className="open-prompt" onClick={() => setIsOpen(true)}>
              <span className="sparkle"><SparkleIcon /></span>
              Clique no envelope para abrir
            </button>
          )}
        </div>
      </section>

      {isOpen && !accepted && noActivated && (
        <button
          className="no-button is-running"
          ref={noButtonRef}
          aria-label="Não — este botão está fugindo"
          style={{ left: noPosition.x, top: noPosition.y }}
          onPointerEnter={(event) => moveNoButton(event.clientX, event.clientY)}
          onPointerDown={(event) => {
            event.preventDefault();
            moveNoButton(event.clientX, event.clientY);
          }}
          tabIndex={-1}
        >
          Não
        </button>
      )}

      <footer>FEITO COM INTENÇÃO • PARA UM MOMENTO ESPECIAL</footer>
    </main>
  );
}
