// Функція для відкриття вкладок
function openTab(tabName) {
    var tabs = document.getElementsByClassName("video-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
    var tabLinks = document.getElementsByClassName("tab-link");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
    document.querySelector('[onclick="openTab(\'' + tabName + '\')"]').classList.add("active");
}

// Функція для відкриття серій
function openSeries(seriesName) {
    var series = document.getElementsByClassName("series-video");
    for (var i = 0; i < series.length; i++) {
        series[i].style.display = "none";
    }
    document.getElementById(seriesName).style.display = "block";
    var seriesLinks = document.getElementsByClassName("series-link");
    for (var i = 0; i < seriesLinks.length; i++) {
        seriesLinks[i].classList.remove("active");
    }
    document.querySelector('[onclick="openSeries(\'' + seriesName + '\')"]').classList.add("active");
    document.getElementById('seriesSelect').value = seriesName;
}

document.getElementById('seriesSelect').addEventListener('change', function () {
    openSeries(this.value);
});

// Set default episode on page load
window.onload = function () {
    openSeries('series1');
};
