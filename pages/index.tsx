import * as React from "react";
import isToday from "date-fns/isToday";
import endOfDay from "date-fns/endOfDay";
import Countdown, { CountdownRenderProps, zeroPad } from "react-countdown";
import { PieChart, Pie, Cell, ResponsiveContainer, PieLabel } from "recharts";
import * as Dialog from "@radix-ui/react-dialog";
import * as Separator from "@radix-ui/react-separator";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Cross2Icon,
  GitHubLogoIcon,
  MoonIcon,
  QuestionMarkCircledIcon,
  Share1Icon,
  SunIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import {
  styled,
  css,
  keyframes,
  theme as lightTheme,
  darkTheme,
} from "../stitches.config";
import type { NextPage } from "next";
import Head from "next/head";

/*****************************
 * CONSTANTS
 */

const LETTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const KEYBOARD_LAYOUT = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];

const CHART_COLORS = [
  "var(--colors-plum9)",
  "var(--colors-cyan9)",
  "var(--colors-orange9)",
  "var(--colors-mauve9)",
  "var(--colors-green9)",
  "var(--colors-sand9)",
  "var(--colors-olive9)",
  "var(--colors-amber9)",
  "var(--colors-tomato9)",
  "var(--colors-slate9)",
  "var(--colors-violet9)",
  "var(--colors-brown9)",
  "var(--colors-crimson9)",
  "var(--colors-gray9)",
  "var(--colors-grass9)",
  "var(--colors-sky9)",
  "var(--colors-indigo9)",
  "var(--colors-sage9)",
  "var(--colors-bronze9)",
  "var(--colors-red9)",
  "var(--colors-gold9)",
  "var(--colors-purple9)",
  "var(--colors-lime9)",
  "var(--colors-yellow9)",
  "var(--colors-pink9)",
  "var(--colors-teal9)",
];

/*****************************
 * TYPES
 */

type S = {
  status: "idle" | "loading" | "loaded" | "complete";
  answer: string;
  expires: Date;
  attempts: number;
  options: string[];
  history: number[];
  theme: "light" | "dark";
};

type A = {
  type: "init" | "ready" | "guess" | "success" | "theme" | "tutorial";
  guess?: string;
  data?: Partial<S>;
  theme?: "light" | "dark";
};

/*****************************
 * ANIMATIONS
 */

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0.5)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

const rotateX = keyframes({
  "0%": { transform: "scaleX(1)" },
  "50%": { transform: "scaleX(0)" },
  "100%": { transform: "scaleX(1)" },
});

/*****************************
 * STYLES
 */

const Container = styled("div", {
  display: "flex",
  flexFlow: "column",
  padding: "0 1rem",
  minHeight: "100%",
  minWidth: "320px",
  maxWidth: "600px",
  margin: "0 auto",
});

const Header = styled("header", {
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid $gray6",
  paddingTop: "$space$1",
  paddingBottom: "$space$1",
  color: "$gray12",
});

const Main = styled("main", {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "$space$3",
  marginBottom: "$space$3",
  marginLeft: "8px",
});

const AboutButton = styled(Popover.Trigger, {
  color: "$gray11",

  "&:hover": {
    color: "$gray12",
  },
});

const AboutContent = styled(Popover.Content, {
  position: "relative",
  maxWidth: "calc(100vw - $space$2)",
  padding: "$space$2",
  borderRadius: "4px",
  boxShadow: "rgb(0, 0, 0, .18) 0px 2px 4px",
  animation: `${scaleIn} 320ms cubic-bezier(0.16, 1, 0.3, 1)`,
  background: "$gray2",
  color: "$gray12",
});

const Divider = styled(Separator.Root, {
  width: "75%",
  height: "1px",
  backgroundColor: "$gray6",
});

const AboutClose = styled(Popover.Close, {
  position: "absolute",
  top: "$space$1",
  right: "$space$1",
});

const ContentContainer = styled("div", {
  display: "flex",
  flexFlow: "column",
  gap: "$space$2",
});

const ThemeButton = styled("button", {
  color: "$gray11",

  "&:hover": {
    color: "$gray12",
  },
});

const Button = styled("button", {
  flex: "0 1 calc(20% - 8px)",
  aspectRatio: 1,
  fontSize: "1.5rem",
  fontWeight: 600,
  border: "2px solid $gray7",
  borderRadius: "2px",
  color: "$gray12",
  cursor: "pointer",
  transition: "color 200ms linear",

  "&:hover:not([aria-disabled='true'])": {
    background: "$gray4",
  },

  "&:active:not([aria-disabled='true'])": {
    background: "$gray5",
  },

  "&[aria-disabled='true']": {
    cursor: "not-allowed",
    color: "$gray2",
    animation: `${rotateX} 500ms cubic-bezier(0.16, 1, 0.3, 1)`,
    background: "$gray9",
  },

  "&[data-almost='true']": {
    background: "$yellow10",
    color: "$gray1",
    opacity: 0.9,
  },

  "&[data-correct='true']": {
    background: "$grass10",
    color: "$gray1",
    cursor: "default",
    opacity: "1",
  },

  "&:disabled": {
    animation: "none",
    pointerEvents: "none",
  },

  "@media (prefers-reduced-motion)": {
    animation: "none",
    transition: "none",
  },
});

const Footer = styled("footer", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "auto",
  padding: "$space$1",
  borderTop: "1px solid $gray6",
  color: "$gray12",
});

const Social = styled("div", {
  display: "flex",

  "& > * + *": {
    marginLeft: "$space$1",
  },
});

const Link = styled("a", {
  textDecoration: "none",
  color: "$blue11",

  "&:hover": {
    color: "$blue12",
  },
});

const SocialLink = styled(Link, {
  display: "flex",
  color: "$gray11",

  "&:hover": {
    color: "$gray12",
  },
});

const Status = styled("div", {
  display: "flex",
  alignItems: "center",

  [`& ${Button}`]: {
    marginRight: "$space$1",
  },
});

const SuccessOverlay = styled(Dialog.Overlay, {
  position: "fixed",
  inset: "0",
  display: "grid",
  placeItems: "center",
  overflowY: "auto",
  background: "$colors$overlay",
});

const SuccessContent = styled(Dialog.Content, {
  position: "relative",
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  gap: "$space$3",
  width: "100%",
  maxWidth: "600px",
  boxShadow: "0 4px 23px 0 rgb(0 0 0 / 20%)",
  background: "$gray2",
  color: "$gray12",
  margin: "$space$4 $space$2",
  padding: "$space$4 $space$2",
  animation: `${scaleIn} 320ms cubic-bezier(0.16, 1, 0.3, 1)`,

  "& h3": {
    color: "$gray11",
    textTransform: "uppercase",
  },
});

const SuccessClose = styled(Dialog.Close, {
  position: "absolute",
  top: "$space$1",
  right: "$space$1",
  zIndex: "1",
  color: "$gray11",

  "&:hover": {
    color: "$gray12",
  },
});

const Statistics = styled("div", {
  display: "flex",
  gap: "$space$2",
  textAlign: "center",

  "@bp1": {
    display: "none",
  },
});

const Statistic = styled("div", {
  flex: "0 1 33%",
  display: "flex",
  flexFlow: "column",
  alignItems: "center",

  "& > div": {
    fontSize: "2rem",
    fontWeight: "700",
  },
});

const ShareButton = styled("button", {
  display: "flex",
  alignItems: "center",
  padding: "$space$1 $space$2",
  background: "$grass9",
  color: "$gray1",
  fontSize: "1.25rem",
  fontWeight: 600,
  borderRadius: "4px",

  "&:hover": {
    background: "$grass10",
  },

  "&:active": {
    background: "$grass11",
  },

  "& > svg": {
    marginLeft: "$space$1",
  },
});

const Timer = styled("span", {
  padding: "0 $space$2",
  fontSize: "2rem",
  fontWeight: "700",
});

const tooltipContent = css({
  background: "$gray3",
  color: "$gray12",
  padding: "$space$1",
  animation: `${scaleIn} 320ms cubic-bezier(0.16, 1, 0.3, 1)`,
  boxShadow: "rgb(0, 0, 0, .18) 0px 2px 4px",
  borderRadius: "4px",
  py: "$space$1",
  px: "$space$2",
});

/*****************************
 * PAGE
 */

const initialState: S = {
  status: "idle",
  options: [],
  answer: (() => LETTERS[Math.floor(Math.random() * LETTERS.length)])(),
  attempts: 0,
  history: [],
  expires: (() => endOfDay(new Date()))(),
  theme: "light",
};

const reducer = (
  state: S,
  { type, data = {}, guess = "", theme = "light" }: A
): S => {
  switch (type) {
    case "init":
      return { ...state, status: "loading" };
    case "ready":
      return { ...state, ...data, status: "loaded" };
    case "success":
      return { ...state, status: "complete" };
    case "guess":
      const isLetter = LETTERS.includes(guess);
      const isGuessed = state.options.includes(guess);
      const isComplete = state.status === "complete";
      const isAnswer = guess === state.answer;

      if (!isLetter || isGuessed || isComplete) {
        return state;
      }

      const attempts = state.attempts + 1;

      const options = [...state.options];
      options.push(guess);

      const history = [...state.history];
      isAnswer && history.push(attempts);

      return {
        ...state,
        attempts,
        options,
        history,
      };
    case "theme":
      return { ...state, theme };
    default:
      throw new Error(`Action type ${type} not recognised`);
  }
};

const Home: NextPage = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const { status, answer, options, history, attempts, expires, theme } = state;
  const latestGuess = options.length ? options.at(-1) : null;

  /* Statistics */
  const sortedHistory = history.sort();
  const bestResult = sortedHistory[0];
  const averageResult = Math.round(
    sortedHistory.reduce((a, b) => a + b, 0) / sortedHistory.length
  );

  /* Countdown timer */
  const countdownRenderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    return completed ? (
      <p> New Letterle available! Refresh to get started!</p>
    ) : (
      <Timer>
        {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
      </Timer>
    );
  };

  /* Chart */
  const historyAccumulator = history.reduce((acc, cur) => {
    acc[`${cur}`] = ++acc[`${cur}`] || 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(historyAccumulator).map((key) => ({
    name: key,
    value: historyAccumulator[key],
  }));

  const chartLabel: PieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const radian = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * radian);
    const y = cy + radius * Math.sin(-midAngle * radian);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {name}
      </text>
    );
  };

  function handleThemeChange() {
    if (theme === "light") {
      dispatch({ type: "theme", theme: "dark" });
    } else {
      dispatch({ type: "theme", theme: "light" });
    }
  }

  function handleShare() {
    const squareKeys = KEYBOARD_LAYOUT.map((letter) => {
      if (letter === answer) {
        return "🟩";
      }

      if (options.includes(letter)) {
        const isInRange = getClose(letter);
        return isInRange ? "🟨" : "🔳";
      }

      return theme === lightTheme ? "⬜" : "⬛";
    });

    const title = `Letterle  #${history.length}  ${attempts}/${KEYBOARD_LAYOUT.length}`;
    const stats = `Average (${averageResult})  |  Personal Best (${bestResult})`;
    const rowOne = squareKeys.slice(0, 10).join(" ");
    const rowTwo = squareKeys.slice(10, 19).join(" ");
    const rowThree = squareKeys.slice(19).join(" ");
    const copy = `${title}\n\n${stats}\n\n${rowOne}\n${rowTwo}\n${rowThree}`;

    navigator.clipboard.writeText(copy).then(
      () => window.alert("Copied to clipboard!"),
      () => window.alert("Uh-oh! Something went wrong! Please try again.")
    );
  }

  function getClose(letter: string) {
    const isGuessed = options.includes(letter);
    const answerIndex = LETTERS.indexOf(answer);
    const letterIndex = LETTERS.indexOf(letter);
    const isInRange =
      letterIndex >= answerIndex - 5 && letterIndex <= answerIndex + 5;

    return isGuessed && isInRange;
  }

  if (status === "idle") {
    dispatch({ type: "init" });
  }

  if (status === "loaded" && latestGuess === answer) {
    dispatch({ type: "success" });
    setIsSuccessModalOpen(true);
  }

  /* Local storage management */
  React.useEffect(() => {
    if (status === "loading") {
      const localData = window.localStorage.getItem("localData");

      /* If no local data exists, set it with the initial ui state */
      if (!localData) {
        window.localStorage.setItem("localData", JSON.stringify(initialState));
        setIsTutorialOpen(true);
        dispatch({ type: "ready" });
        return;
      }

      const parsedData = JSON.parse(localData);
      const parsedExpiry = new Date(parsedData.expires);
      const newData = { ...initialState, history: parsedData.history };

      /* If the local storage data has not expired, update the ui state with it */
      if (isToday(new Date(parsedExpiry))) {
        dispatch({ type: "ready", data: parsedData });
        return;
      }

      /* If the local storage data has expired, replace it and the ui state with fresh data */
      window.localStorage.setItem("localData", JSON.stringify(newData));
      dispatch({ type: "ready", data: newData });
    }

    /* Synchronise local storage and state */
    window.localStorage.setItem("localData", JSON.stringify(state));
  }, [status, state]);

  /* Global keyboard events */
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) =>
      dispatch({ type: "guess", guess: e.key });

    window.addEventListener("keypress", handleKeyPress, false);

    return () => {
      window.addEventListener("keypress", handleKeyPress, false);
    };
  }, []);

  /* Theming */
  React.useEffect(() => {
    if (theme === "light") {
      document.body.classList.add(lightTheme);
      document.body.classList.remove(darkTheme);
    }

    if (theme === "dark") {
      document.body.classList.add(darkTheme);
      document.body.classList.remove(lightTheme);
    }
  }, [theme]);

  /* Initial styling */
  React.useEffect(() => {
    /* Default to dark theme to match the user's system preferences */
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      dispatch({ type: "theme", theme: "dark" });
    }

    /* Prevent FOUC on first page load */
    document.body.classList.add("loaded");
  }, []);

  return (
    <Container>
      <Tooltip.Provider delayDuration={64} skipDelayDuration={250}>
        <Head>
          <title>Letterle - A letter guessing game</title>
          <meta name="description" content="A daily letter guessing game" />
          <link rel="icon" href="/favicon.ico" />

          <link
            rel="preload"
            href="/fonts/Montserrat-Regular.ttf"
            as="font"
            crossOrigin=""
          />

          <link
            rel="preload"
            href="/fonts/Lato-Regular.ttf"
            as="font"
            crossOrigin=""
          />

          <link
            rel="preload"
            href="/fonts/Lato-SemiBold.ttf"
            as="font"
            crossOrigin=""
          />
        </Head>

        <Header>
          <Popover.Root
            open={isTutorialOpen}
            onOpenChange={() => setIsTutorialOpen(!isTutorialOpen)}
          >
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <AboutButton>
                  <QuestionMarkCircledIcon width={24} height={24} />
                  <VisuallyHidden>How to play</VisuallyHidden>
                </AboutButton>
              </Tooltip.Trigger>

              <Tooltip.Content className={tooltipContent()}>
                How to play
              </Tooltip.Content>
            </Tooltip.Root>

            <AboutContent>
              <AboutClose>
                <Cross2Icon width={24} height={24} />
                <VisuallyHidden>Close</VisuallyHidden>
              </AboutClose>

              <ContentContainer>
                <h2>Welcome to Letterle!</h2>

                <p>
                  The aim of the game is to find the hidden letter in as few
                  attempts as possible!
                </p>

                <p>
                  After each guess, the color of the letter will change to show
                  if you correctly guessed the letter.
                </p>

                <p>
                  The game will end when you successfully uncover the hidden
                  letter.
                </p>

                <Divider decorative />

                <Status>
                  <Button data-correct disabled css={{ flex: "0 1 auto" }}>
                    A
                  </Button>

                  <p>
                    The letter <span style={{ fontWeight: 600 }}>A</span> is the
                    correct letter!
                  </p>
                </Status>

                <Status>
                  <Button data-almost disabled css={{ flex: "0 1 auto" }}>
                    B
                  </Button>

                  <p>
                    The letter <span style={{ fontWeight: 600 }}>B</span> is
                    within five characters of the correct letter
                  </p>
                </Status>

                <Status>
                  <Button aria-disabled disabled css={{ flex: "0 1 auto" }}>
                    C
                  </Button>

                  <p>
                    The letter <span style={{ fontWeight: 600 }}>C</span> is an
                    incorrect guess
                  </p>
                </Status>

                <Status>
                  <Button disabled css={{ flex: "0 1 auto" }}>
                    D
                  </Button>

                  <p>
                    The letter <span style={{ fontWeight: 600 }}>D</span> has
                    not yet been selected
                  </p>
                </Status>

                <Divider decorative />

                <p>A new letter will be available each day!</p>
              </ContentContainer>
            </AboutContent>
          </Popover.Root>

          <h1>Letterle</h1>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <ThemeButton onClick={handleThemeChange}>
                {theme === "light" ? (
                  <SunIcon width={24} height={24} />
                ) : (
                  <MoonIcon width={24} height={24} />
                )}
                <VisuallyHidden>Theme</VisuallyHidden>
              </ThemeButton>
            </Tooltip.Trigger>

            <Tooltip.Content className={tooltipContent()}>
              Theme
            </Tooltip.Content>
          </Tooltip.Root>
        </Header>

        {status === "loading" ? (
          <Main>
            <p>Loading....</p>
          </Main>
        ) : (
          <Main>
            {LETTERS.map((letter) => (
              <Button
                key={letter}
                disabled={status === "complete"}
                aria-disabled={options.includes(letter)}
                data-almost={getClose(letter)}
                data-correct={status === "complete" && answer === letter}
                onClick={() => dispatch({ type: "guess", guess: letter })}
              >
                {letter.toUpperCase()}
              </Button>
            ))}
          </Main>
        )}

        <Footer>
          <p>
            Inspired by&nbsp;
            <Link
              href="https://www.powerlanguage.co.uk/wordle/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wordle
            </Link>
          </p>

          <Social>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <SocialLink
                  href="https://twitter.com/phunkren"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterLogoIcon width={24} height={24} />
                  <VisuallyHidden>Twitter</VisuallyHidden>
                </SocialLink>
              </Tooltip.Trigger>

              <Tooltip.Content className={tooltipContent()}>
                Twitter
              </Tooltip.Content>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <SocialLink
                  href="https://github.com/phunkren/letterle"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubLogoIcon width={24} height={24} />
                  <VisuallyHidden>GitHub</VisuallyHidden>
                </SocialLink>
              </Tooltip.Trigger>

              <Tooltip.Content className={tooltipContent()}>
                GitHub
              </Tooltip.Content>
            </Tooltip.Root>
          </Social>
        </Footer>

        <Dialog.Root
          open={isSuccessModalOpen}
          onOpenChange={() => setIsSuccessModalOpen(!isSuccessModalOpen)}
        >
          <Dialog.Portal>
            <SuccessOverlay>
              <SuccessContent>
                <SuccessClose>
                  <Cross2Icon width={24} height={24} />
                  <VisuallyHidden>Close</VisuallyHidden>
                </SuccessClose>

                <Dialog.Title>Congratulations!</Dialog.Title>

                <Dialog.Description>
                  You have solved todays puzzle
                </Dialog.Description>

                <Divider decorative />

                <h3>Statistics</h3>

                <Statistics>
                  <Statistic>
                    <div>{attempts}</div>
                    <p>Today</p>
                  </Statistic>
                  <Statistic>
                    <div>{averageResult}</div>
                    <p>Average</p>
                  </Statistic>
                  <Statistic>
                    <div>{bestResult}</div>
                    <p>Best</p>
                  </Statistic>
                </Statistics>

                <Divider decorative />

                <h3>Distribution</h3>

                <div
                  style={{
                    minHeight: "200px",
                  }}
                >
                  <PieChart height={250} width={250}>
                    <Pie
                      data={chartData}
                      label={chartLabel}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="100%"
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={CHART_COLORS[index % CHART_COLORS.length]}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </div>

                <Divider decorative />

                <h3>Next available</h3>

                <Countdown date={expires} renderer={countdownRenderer} />

                <Divider decorative />

                <ShareButton onClick={handleShare}>
                  Share <Share1Icon width={24} height={24} />
                </ShareButton>
              </SuccessContent>
            </SuccessOverlay>
          </Dialog.Portal>
        </Dialog.Root>
      </Tooltip.Provider>
    </Container>
  );
};

export default Home;
