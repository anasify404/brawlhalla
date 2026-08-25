const form = document.querySelector("#input");
const inputId = document.querySelector("#inputId");
const playerNotFound = document.querySelector("#playerNotFound");
const playerIdSection = document.querySelector("#playerIdSection");
const playerTopLegends = document.querySelector("#playerTopLegends");

let playerData = {};
let legendsProfiles = [];
let legendsData = [];
let legendResultData = [];
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
  fetch(`./data/legends.json`)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      legendsProfiles = data.legends;
    })
    .catch((err) => {
      console.log(err);
    });
}

function getData(id) {
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
      showCard(playerData, legendsData, legendsProfiles);
    })
    .catch((err) => {
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
}

//lrd contains two objects legend and profile
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
