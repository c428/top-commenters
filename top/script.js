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
];

const pluck = (arr, key) => arr.map((i) => i[key]);

fetchData();

async function fetchData() {
  const Array = [];
  for (let i = 0; i < channels.length; i++) {
    try {
      const response = await fetch(
        "https://backend.mixerno.space/api/youtube/estv3/" + channels[i]
      );

      if (!response.ok) {
        throw new Error("Could not fetch resource.");
      }

      const data = await response.json();
      if (data.items[0].snippet.title != null) {
        Array.push({
          id: channels[i],
          name: data.items[0].snippet.title,
          subs: data.items[0].statistics.subscriberCount,
        });
      } else {
        Array.push({
          id: channels[i],
          name: "",
          subs: data.items[0].statistics.subscriberCount,
        });
      }
      var sorted = Array.sort(({ subs: a }, { subs: b }) => b - a);
      console.log(sorted);
    } catch (err) {
      console.error(err);
    }
  }
  for (let i = 0; i < sorted.length; i++) {
    var channelIds = pluck(sorted, "id");
    var channelNames = pluck(sorted, "name");
    var channelSubs = pluck(sorted, "subs");
    const response = await fetch(
      "https://backend.mixerno.space/api/youtube/estv3/" + channelIds[i]
    );
    const data = await response.json();
    const pfp = data.items[0].snippet.thumbnails.default.url;
    var div = document.createElement("div");
    document.getElementById("clist").appendChild(div);
    div.className = "ui";
    div.id = "channel" + [i];
    div.innerHTML =
      '<img class="pfp" src="' +
      pfp +
      '"></img><p>' +
      [i + 1] +
      ". " +
      channelNames[i] +
      " - " +
      channelSubs[i] +
      "</p>";
  }
  document.getElementById("Loading").remove();
}
