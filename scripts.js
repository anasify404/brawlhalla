const form = document.querySelector("#input");
const inputId = document.querySelector("#inputId");
const playerNotFound = document.querySelector("#playerNotFound");
const playerIdSection = document.querySelector("#playerIdSection");
const playerTopLegends = document.querySelector("#playerTopLegends");
const fetchPDataNotify = document.querySelector("#fetchPDataNotify");
const fetchLDataNotify = document.querySelector("#fetchLDataNotify");
// const fetchPRoastNotify = document.querySelector("#fetchPRoastNotify");
let aiRoastResponse;
let playerData = {};
let legendsProfiles = [];
let legendsData = [];
let legendResultData = [];
// const prompt =
//   "You are a Brawlhalla player-stat roast generator. Your job is to roast the player based ONLY on the statistics provided. Rules: - Be funny, clever, competitive, and slightly savage. - Keep it playful, not genuinely hateful or offensive. - Identify the most embarrassing or interesting patterns in the stats. - Use specific numbers from the data whenever possible. - Do not invent statistics, achievements, or facts. - Do not explain the statistics like a report. - Write like a Brawlhalla player roasting another player. - Maximum 3 sentences. - No emojis. - No generic jokes that could apply to anyone. - If the stats are actually impressive, roast them by exaggerating their try-hard/pro-player behavior instead.";

// playerIdSection.innerHTML = "";

function getLegendsResultData(lp, ld) {
  legendResultData = ld.map((legend) => {
    const profile = lp.find((item) => {
      return item.legend_id === legend.legend_id;
    });
    return {
      ...legend,
      ...profile,
    };
  });
  console.log(legendResultData);

  for (let i = 0; i < ld.length; i++) {
    createLegendCard(legendResultData[i]);
  }
}
function getLegendsProfiles() {
  fetchLDataNotify.classList.remove("toggle");

  fetch(`./data/legends.json`)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      legendsProfiles = data.legends;
      fetchLDataNotify.classList.add("toggle");
    })
    .catch((err) => {
      fetchLDataNotify.classList.add("toggle");

      console.log(err);
    });
}

function getData(id) {
  fetchPDataNotify.classList.remove("toggle");

  fetch(`https://api.brawlhalla.com/v1/player/stats?brawlhalla_id=${id}`)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      playerData.brawlhalla_id = data.brawlhalla_id;
      playerData.name = data.name;
      playerData.games = data.games;
      playerData.wins = data.wins;
      playerData.losses = data.games - data.wins;
      playerData.winRate = ((data.wins / data.games) * 100).toFixed(2);
      // console.log(playerData);
      console.log(data.legends.sort((a, b) => b.games - a.games));

      legendsData = data.legends.sort(function (a, b) {
        b.games - a.games;
      }); //sorted array chahiye descending order of games
      console.log(legendsData);
      fetchPDataNotify.classList.add("toggle");
      showCard(playerData, legendsData, legendsProfiles);
    })
    .catch((err) => {
      fetchPDataNotify.classList.add("toggle");
      console.log(err);
      if (playerNotFound.classList.contains("toggle")) {
        playerNotFound.classList.remove("toggle");
      }
      playerIdSection.innerHTML = "";
      playerTopLegends.innerHTML = "";
    });
}

function createPlayerCard(obj) {
  const playerHeading = document.createElement("h2");
  playerHeading.classList.add("heading");
  playerHeading.textContent = "Player Stats:";

  // const aiRoastBtn = document.createElement("button");
  // aiRoastBtn.classList.add("aiRoastBtn");
  // aiRoastBtn.textContent = "AI Roast Me!";

  const playerCard = document.createElement("div");
  playerCard.classList.add("playerCard");

  const playerContent = document.createElement("div");
  playerContent.classList.add("playerContent");

  const name = document.createElement("h3");
  name.classList.add("name");
  name.textContent = `@${obj.name}`;

  const bhId = document.createElement("p");
  bhId.classList.add("bhId");
  bhId.textContent = `ID: ${obj.brawlhalla_id}`;

  playerContent.append(name, bhId);

  const stats = document.createElement("div");
  stats.classList.add("stats");

  const section1 = document.createElement("div");
  section1.classList.add("section1");

  // const level = document.createElement("p");
  // level.textContent = `Level: ${obj.level}`;

  // const xp = document.createElement("p");
  // xp.textContent = `XP: ${obj.xp}`;

  const games = document.createElement("p");
  games.textContent = `Games: ${obj.games}`;

  const section2 = document.createElement("div");
  section2.classList.add("section2");

  const wins = document.createElement("p");
  wins.textContent = `Wins: ${obj.wins}`;

  const losses = document.createElement("p");
  losses.textContent = `Loss: ${obj.games - obj.wins}`;

  const winRate = document.createElement("p");
  const rate = ((obj.wins / obj.games) * 100).toFixed(2);
  winRate.textContent = `Win Rate: ${rate}%`;

  section1.append(games, winRate);
  section2.append(wins, losses);

  stats.append(section1, section2);

  const winRateGraph = document.createElement("div");
  winRateGraph.classList.add("winRateGraph");

  const win = document.createElement("div");
  win.classList.add("win");
  win.style.width = `${rate}%`;

  const loss = document.createElement("div");
  loss.classList.add("loss");
  loss.style.width = `${100 - rate}%`;

  winRateGraph.append(win, loss);

  playerCard.append(playerContent, stats, winRateGraph);
  playerIdSection.append(playerHeading, playerCard);
  // playerIdSection.append(playerHeading, playerCard, aiRoastBtn);

  // let count = 0;

  // aiRoastBtn.addEventListener("click", () => {
  //   console.log("clicked!");
  //   count++;
  //   if (count < 2) aiRoast(prompt, playerData, legendResultData);
  // });
}

//lrd contains two objects legend and profile, pmt prompt

// async function aiRoast(pmt, pd, lrd) {
//   console.log("loading data...");
//   fetchPRoastNotify.classList.remove("toggle");
//   try {
//     const resp = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-goog-api-key":
//             "API_KEY",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `${pmt}: Player Data${pd}, Legends' Data: ${lrd}`,
//                 },
//               ],
//             },
//           ],
//         }),
//       },
//     );
//     const data = await resp.json();
//     console.log(data);
//     aiRoastResponse = data.candidates[0].content.parts[0].text;
//     fetchPRoastNotify.classList.add("toggle");
//     createRoastCard(aiRoastResponse);
//   } catch {
//     console.log("Error: GEMINI");
//   }
// }

// function createRoastCard(roast) {
//   const aiRoastCard = document.createElement("div");
//   aiRoastCard.classList.add("aiRoastCard");

//   const aiRoastHeading = document.createElement("h2");
//   aiRoastHeading.classList.add("aiRoastHeading");
//   aiRoastHeading.textContent = "AI ROAST:";

//   const aiRoastContent = document.createElement("p");

//   aiRoastContent.textContent = roast;

//   aiRoastCard.append(aiRoastHeading, aiRoastContent);
//   playerIdSection.after(aiRoastCard);
// }

function createLegendCard(lrd) {
  const legendCard = document.createElement("div");
  legendCard.classList.add("legendCard");

  const legendPfp = document.createElement("img");
  legendPfp.classList.add("legendPfp");
  legendPfp.src = lrd.legend_src;
  legendPfp.alt = lrd.legend_id;

  const legendInfo = document.createElement("div");
  legendInfo.classList.add("legend-info");

  const legendName = document.createElement("h3");
  legendName.classList.add("legend-name");
  legendName.textContent = `Legend: ${lrd.legend_name}`;

  const legendStats = document.createElement("div");
  legendStats.classList.add("legend-stats");

  const games = document.createElement("p");
  games.textContent = `Games: ${lrd.games}`;

  const wins = document.createElement("p");
  wins.textContent = `Wins: ${lrd.wins}`;

  const winRate = document.createElement("p");
  winRate.textContent = `Win Rate: ${((lrd.wins / lrd.games) * 100).toFixed(2)}`;

  const kos = document.createElement("p");
  kos.textContent = `KOs: ${lrd.kos}`;

  const spearKOs = document.createElement("p");
  spearKOs.textContent = `${lrd.weapon_one} KOs:${lrd.ko_weapon_one}`;

  const lanceKOs = document.createElement("p");
  lanceKOs.textContent = `${lrd.weapon_two} KOs:${lrd.ko_weapon_two}`;

  const falls = document.createElement("p");
  falls.textContent = `Falls: ${lrd.falls}`;

  const suicides = document.createElement("p");
  suicides.textContent = `Suicides: ${lrd.suicides}`;

  legendStats.append(
    games,
    wins,
    winRate,
    kos,
    spearKOs,
    lanceKOs,
    falls,
    suicides,
  );

  legendInfo.append(legendName, legendStats);
  legendCard.append(legendPfp, legendInfo);
  playerTopLegends.append(legendCard);
}
//pd - playerdata and ld is legendsdata
function showCard(pd, ld, lp) {
  playerIdSection.innerHTML = "";
  playerTopLegends.innerHTML = "";

  getLegendsResultData(lp, ld);

  createPlayerCard(pd);

  if (playerNotFound.classList.contains("toggle")) {
    playerNotFound.classList.add("toggle");
  }
}

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  getLegendsProfiles();

  if (!playerNotFound.classList.contains("toggle"))
    playerNotFound.classList.add("toggle");

  getData(inputId.value);
  form.reset();
});
