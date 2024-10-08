if (sessionStorage.set != null) {
  document.getElementById("bought").value = sessionStorage.set;
} else {
  document.getElementById("bought").value = "Show";
}

const channels = [
  "UCPW_cNzrDSf0xejLOKvV7Cg",
  "UC775DwuDDYTrMRNzAcjcVbw",
  "UCC8v2dYVVkY3RLifFbu257g",
  "UCU-Xk8vOheoXN67TXVjoxvQ",
  "UCA0aReZDp_U40ih7TKB2bHg",
  "UCTXcyi464sJNDMlDzFN0rcw",
  "UC7OlOKaYVCzJpG8h1HveElw",
  "UC9XI2_8_vw-XdxU6Ns5GexA",
  "UC-eHa-b4udma8bGlpPxWB7A",
  "UCtkbSqvw_gSWnY4vLpYtK6A",
  "UClFDTPiMwDQpppSO-gnkFAQ",
  "UCvu_BE1wWyjatsMIwUPTjHA",
  "UCuMjCvjZ9d2s4ZakmyxL4fQ",
  "UCa6S_fqxm8iGaRywGcgShEg",
  "UCPp8olIs1fgWwRHlzv-tcUA",
  "UCMO5JPRfP-AwI7kB0F8RAXw",
  "UCiTfB-A55Vq2fB610vaWJVA",
  "UCWSx4PUbGLZA9hvWZmrimzw",
  "UCIjz-1fbBATo_ONt6rJzrqg",
  "UCZsVjiMSN9Y2s3gFnMNwxqg",
  "UC3RIcfnBQinhnhKHCIEA16Q",
  "UC7G_LkTLLqeeFVjq0Ry9XQQ",
  "UCneVuxEgu48a1moXu8ifihQ",
  "UCiBwUTzU7RmyY-T8C6bE5cQ",
  "UCmkuII8NHjDqnU2rJTQrKgg",
  "UCeDSghsyAtM2B1WezvMcOXw",
  "UCksoVekEVuQihFOdMoRqTnw",
  "UCTwXQXZZ2y37NbDo7PZ_WSQ",
  "UCuaY85j20IAEviKBYsqNxoQ",
  "UCghEZNoAMdiW22KJbMWpkaw",
  "UCLGNYuxBxGtoC_ouDOxLI-A",
];

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const pluck = (arr, key) => arr.map((i) => i[key]);

fetchData();

async function fetchData() {
  try {
    document.getElementById("clist").innerHTML = "";
    document.getElementById("clist").style.display = "none";
  } catch (err) {
    console.error(err);
  }
  document.getElementById("Loading").style.display = "block";
  const Array = [];
  for (let i = 0; i < channels.length; i++) {
    document.getElementById("Loading").innerHTML =
      [i + 1] + "/" + channels.length + " channels fetched.";
    try {
      const response = await fetch(
        "https://backend.mixerno.space/api/youtube/estv3/" + channels[i]
      );

      if (!response.ok) {
        throw new Error("Could not fetch resource.");
      }

      const data = await response.json();
      if (
        data.items[0].snippet.title == "Chicken" ||
        data.items[0].snippet.title == "x" ||
        data.items[0].snippet.title == "New 247" ||
        data.items[0].snippet.title == "Peely" ||
        data.items[0].snippet.title == "Pig" ||
        data.items[0].snippet.title == "Odurs" ||
        data.items[0].snippet.title == "RabbitsOnTheRoad"
      ) {
        Array.push({
          id: channels[i],
          name: data.items[0].snippet.title,
          subs: data.items[0].statistics.subscriberCount,
          bought: "True",
        });
      } else {
        Array.push({
          id: channels[i],
          name: data.items[0].snippet.title,
          subs: data.items[0].statistics.subscriberCount,
          bought: "False",
        });
      }
      var sorted = Array.sort(({ subs: a }, { subs: b }) => b - a);
      console.log(sorted);
    } catch (err) {
      console.error(err);
    }
  }
  if (document.getElementById("bought").value == "Show") {
    for (let i = 0; i < sorted.length; i++) {
      var channelIds = pluck(sorted, "id");
      var channelNames = pluck(sorted, "name");
      var channelSubs = pluck(sorted, "subs");
      var channelBought = pluck(sorted, "bought");
      const response = await fetch(
        "https://backend.mixerno.space/api/youtube/estv3/" + channelIds[i]
      );
      const data = await response.json();
      const pfp = data.items[0].snippet.thumbnails.default.url;
      if ([i] == 0) {
        var div1 = document.getElementById("outerfirst");
        var div2 = document.createElement("div");
        div2.className = "first";
        div2.id = "first";
        div1.innerHTML =
          '<p style="margin:0.5vw;font-weight:600;">1st</p><a href="https://www.youtube.com/channel/' +
          channelIds[i] +
          '"><img class="pfp" style="outline:white solid .3vw;" src="' +
          pfp +
          '"></img></a>';
        document.getElementById("outerfirst").appendChild(div2);
        div2.innerHTML =
          '<div class="channelinfo"><p style="margin:0;font-weight:600;">' +
          channelNames[i] +
          '</p><p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">' +
          numberWithCommas(channelSubs[i]) +
          "</span></div>";
        document.getElementById("Loading").innerHTML =
          [i + 1] + "/" + channels.length + " channels loaded.";
      } else if ([i] == 1) {
        var div1 = document.getElementById("outersecond");
        var div2 = document.createElement("div");
        div2.className = "second";
        div2.id = "second";
        div1.innerHTML =
          '<p style="margin:0.5vw;font-weight:600;">2nd</p><a href="https://www.youtube.com/channel/' +
          channelIds[i] +
          '"><img class="pfp" style="outline:white solid .3vw;" src="' +
          pfp +
          '"></img></a>';
        document.getElementById("outersecond").appendChild(div2);
        div2.innerHTML =
          '<div class="channelinfo"><p style="margin:0;font-weight:600;">' +
          channelNames[i] +
          '</p><p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">' +
          numberWithCommas(channelSubs[i]) +
          "</span></div>";
        document.getElementById("Loading").innerHTML =
          [i + 1] + "/" + channels.length + " channels loaded.";
      } else if ([i] == 2) {
        var div1 = document.getElementById("outerthird");
        var div2 = document.createElement("div");
        div2.className = "third";
        div2.id = "third";
        div1.innerHTML =
          '<p style="margin:0.5vw;font-weight:600;">3rd</p><a href="https://www.youtube.com/channel/' +
          channelIds[i] +
          '"><img class="pfp" style="outline:white solid .3vw;" src="' +
          pfp +
          '"></img></a>';
        document.getElementById("outerthird").appendChild(div2);
        div2.innerHTML =
          '<div class="channelinfo"><p style="margin:0;font-weight:600;">' +
          channelNames[i] +
          '</p><p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">' +
          numberWithCommas(channelSubs[i]) +
          "</span></div>";
        document.getElementById("Loading").innerHTML =
          [i + 1] + "/" + channels.length + " channels loaded.";
      } else {
        var div = document.createElement("div");
        document.getElementById("clist").appendChild(div);
        div.className = "ui";
        div.id = "channel" + [i];
        div.innerHTML =
          '<a href="https://www.youtube.com/channel/' +
          channelIds[i] +
          '"><img class="pfp" src="' +
          pfp +
          '"></img></a><div class="channelinfo"><p style="margin:0;">' +
          [i + 1] +
          ". " +
          channelNames[i] +
          '</p><p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">' +
          numberWithCommas(channelSubs[i]) +
          "</span></div>";
        document.getElementById("Loading").innerHTML =
          [i + 1] + "/" + channels.length + " channels loaded.";
      }
    }
  } else {
    let j = 0;
    for (let i = 0; i < sorted.length; i++) {
      var channelIds = pluck(sorted, "id");
      var channelNames = pluck(sorted, "name");
      var channelSubs = pluck(sorted, "subs");
      var channelBought = pluck(sorted, "bought");
      const response = await fetch(
        "https://backend.mixerno.space/api/youtube/estv3/" + channelIds[i]
      );
      const data = await response.json();
      if (channelBought[i] == "False") {
        const pfp = data.items[0].snippet.thumbnails.default.url;
        if ([j] == 0) {
          var div1 = document.getElementById("outerfirst");
          var div2 = document.createElement("div");
          div2.className = "first";
          div2.id = "first";
          div1.innerHTML =
            '<p style="margin:0.5vw;font-weight:600;">1st</p><a href="https://www.youtube.com/channel/' +
            channelIds[i] +
            '"><img class="pfp" style="outline:white solid .3vw;" src="' +
            pfp +
            '"></img></a>';
          document.getElementById("outerfirst").appendChild(div2);
          div2.innerHTML =
            '<div class="channelinfo"><p style="margin:0;font-weight:600;">' +
            channelNames[i] +
            '</p><p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">' +
            numberWithCommas(channelSubs[i]) +
            "</span></div>";
          j++;
          document.getElementById("Loading").innerHTML =
            [j + 1] + "/" + channels.length + " channels loaded.";
        } else if ([j] == 1) {
          var div1 = document.getElementById("outersecond");
          var div2 = document.createElement("div");
          div2.className = "second";
          div2.id = "second";
          div1.innerHTML =
            '<p style="margin:0.5vw;font-weight:600;">2nd</p><a href="https://www.youtube.com/channel/' +
            channelIds[i] +
            '"><img class="pfp" style="outline:white solid .3vw;" src="' +
            pfp +
            '"></img></a>';
          document.getElementById("outersecond").appendChild(div2);
          div2.innerHTML =
            '<div class="channelinfo"><p style="margin:0;font-weight:600;">' +
            channelNames[i] +
            '</p><p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">' +
            numberWithCommas(channelSubs[i]) +
            "</span></div>";
          j++;
          document.getElementById("Loading").innerHTML =
            [j + 1] + "/" + channels.length + " channels loaded.";
        } else if ([j] == 2) {
          var div1 = document.getElementById("outerthird");
          var div2 = document.createElement("div");
          div2.className = "third";
          div2.id = "third";
          div1.innerHTML =
            '<p style="margin:0.5vw;font-weight:600;">3rd</p><a href="https://www.youtube.com/channel/' +
            channelIds[i] +
            '"><img class="pfp" style="outline:white solid .3vw;" src="' +
            pfp +
            '"></img></a>';
          document.getElementById("outerthird").appendChild(div2);
          div2.innerHTML =
            '<div class="channelinfo"><p style="margin:0;font-weight:600;">' +
            channelNames[i] +
            '</p><p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">' +
            numberWithCommas(channelSubs[i]) +
            "</span></div>";
          j++;
          document.getElementById("Loading").innerHTML =
            [j + 1] + "/" + channels.length + " channels loaded.";
        } else {
          var div = document.createElement("div");
          document.getElementById("clist").appendChild(div);
          div.className = "ui";
          div.id = "channel" + [i];
          div.innerHTML =
            '<a href="https://www.youtube.com/channel/' +
            channelIds[i] +
            '"><img class="pfp" src="' +
            pfp +
            '"></img></a><div class="channelinfo"><p style="margin:0;">' +
            [j + 1] +
            ". " +
            channelNames[i] +
            '</p><p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">' +
            numberWithCommas(channelSubs[i]) +
            "</span></div>";
          j++;
          document.getElementById("Loading").innerHTML =
            [j + 1] + "/" + channels.length + " channels loaded.";
        }
      } else {
      }
    }
  }
  document.getElementById("Loading").style.display = "none";
  document.getElementById("clist").style.display = "flex";
  document.getElementById("top3").style.display = "flex";
}

function refresh() {
  sessionStorage.setItem("set", document.getElementById("bought").value);
  window.location.href = window.location.href;
}
