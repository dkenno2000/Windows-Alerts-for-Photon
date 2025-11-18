import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

let divA, divB, divC, divD, A, img, ACheck, ARug, AX, AXN;
let balanceFetched = false;
const twentyFourHours = 24 * 60 * 60 * 1000;
const tenMinutes = 10 * 60 * 1000;

function TooltipPhoton2() {
    const tooltipNeo = document.querySelector(".remastered-tooltip");
    let showTimeout, hideTimeout;

    document.querySelectorAll("[data-tooltip2]").forEach(elem => {
        elem.addEventListener("mouseenter", function() {
            clearTimeout(hideTimeout);
            showTimeout = setTimeout(() => {
                tooltipNeo.textContent = this.dataset.tooltip2;
                const rect = this.getBoundingClientRect();
                tooltipNeo.style.left = rect.left + window.scrollX + "px";
                tooltipNeo.style.top = rect.bottom + window.scrollY + "px";
                tooltipNeo.style.display = "block";
                tooltipNeo.style.opacity = "1";
            }, 750);
        });
        elem.addEventListener("mouseleave", function() {
            clearTimeout(showTimeout);

            hideTimeout = setTimeout(() => {
                tooltipNeo.style.display = "none";
            }, 250);
        });
    });
}

// SOLANA CURRENT PRICE
let globalPrice = null;

async function GetPrice2() {
  const walletAddress = document.querySelector('.c-wdd__item input[type="checkbox"]:checked')?.closest('.c-wdd__item')?.dataset.wallet;
  if (!walletAddress) return;

  const symbol = "SOLTUSD";
  const apiUrl = `https://coin-checker.xyz/solana/${walletAddress}/status/${symbol}`;
  const { Options } = await chrome.storage.local.get("Options");
  const lastRequest = Options?.lastRequest || 0;
  const now = Date.now();
  const timeLimit = twentyFourHours;

  let fetchNeeded = now - lastRequest >= timeLimit;

  if (fetchNeeded) {
    try {
        const response = await fetch(apiUrl, { method: 'GET', mode: 'cors', credentials: 'include' });
        if (!response.ok) return null;

        const data = await response.json();
        await chrome.storage.local.set({ Options: { ...Options, lastRequest: now } });
        return data.price;

    } catch (error) {
        return null;
    }
  }
}

async function GetPrice() {
    const now = Date.now();
    const { SOL = {} } = await chrome.storage.local.get('SOL');
    if (now - SOL.lastCheck < tenMinutes){
        return SOL.price;
    }

    const endpoints = [
        { name: "Binance US", url: "https://api.binance.us/api/v3/ticker/price" },
        { name: "Binance", url: "https://api.binance.com/api/v3/ticker/price" }
    ];
    const symbol = "SOLUSDT";

    for (const { name, url } of endpoints) {
        try {
            const response = await fetch(`${url}?symbol=${symbol}`);
            if (!response.ok) console.log(`HTTP error from ${name}! Status: ${response.status}`);
            const data = await response.json();
            await chrome.storage.local.set({ SOL: { ...SOL, price: data.price, lastCheck: now } });
            return data.price;
        } catch (error) {}
    }
    console.log("Failed to fetch SOL price.");
    return null;
}

async function SolPrice() {
  setTimeout(async () => {
    const target = document.querySelector(".c-header .l-col.l-col-auto-lg.l-col-xl .u-d-flex.u-align-items-center.u-justify-content-end");

    if (!target) return;
    const alreadyDone = document.getElementById("SOL-price");
    if (alreadyDone) return;


    const div = document.createElement("div");
    div.className = "u-d-flex u-align-items-center";
    div.setAttribute("data-tooltip2", "Current Price of Solana");

    const divB = document.createElement("div");
    divB.className = "solana-price";

    const span = document.createElement("span");
    span.className = "font-sol";
    span.id = "SOL-price";

    target.prepend(div);
    div.appendChild(divB);
    divB.appendChild(span);

    const price = await GetPrice2() || await GetPrice();
    const priceSpan = document.getElementById("SOL-price");

    if (!priceSpan) {
      return;
    }

    if (price) {
      priceSpan.innerHTML = `<span id="current-solana-price">SOL: </span>$${
        Math.round(price * 100) / 100
      }`;
    } else {
      priceSpan.innerHTML = '<span id="current-solana-price">SOL: N/A</span>';
    }

    TooltipPhoton2();
  }, 200);
}

// PIE CHARTS
let divsCreated = false;
let holdersTabPresent = false;

let Pool = 0;
let Dev = 0;
let Happy = 0;
let Ghost = 0;
let Snipe = 0;
let Others = 0;
let All = 0;

let Shrimps = 0;
let Fish = 0;
let Sharks = 0;
let Whales = 0;
let AllSol = 0;

function resetValues() {
    Pool = 0;
    Dev = 0;
    Happy = 0;
    Ghost = 0;
    Snipe = 0;
    Others = 0;
    All = 0;

    Shrimps = 0;
    Fish = 0;
    Sharks = 0;
    Whales = 0;
    AllSol = 0;
}

function updateValues() {
    const Holderstab = document.querySelectorAll('[data-table-id="holders"]');
    if (Holderstab) {
        document.querySelectorAll('.c-grid-table__tr').forEach(row => {
            const percentageElement = row.querySelector('.c-grid-table__td:nth-child(3) .u-color-light-alt');
            const percentage = percentageElement ? parseFloat(percentageElement.textContent) : 0;

            const balanceElement = row.querySelector('.c-grid-table__td:nth-child(1) .u-color-light-alt');
            const balance = balanceElement ? parseFloat(balanceElement.textContent) : 0;

            if (row.querySelector('span.c-icon--emoji-happy')) {
                Happy += percentage;
            } else if (row.querySelector('span.c-icon--ghost')) {
                Ghost += percentage;
            } else if (row.querySelector('span.c-icon--snipe')) {
                Snipe += percentage;
            } else if (row.querySelector('div.c-tag--pink')) {
                Pool += percentage;
            } else if (row.querySelector('div.c-tag--yellow')) {
                Dev += percentage;
            } else {
                Others += percentage;
            }

            if (balance <= 1)
            {
                Shrimps += 1;
                AllSol += 1;
            }
            else if (balance <= 5)
            {
                Fish += 1;
                AllSol += 1;
            }
            else if (balance <= 50)
            {
                Sharks += 1;
                AllSol += 1;
            }
            else
            {
                Whales += 1;
                AllSol += 1;
            }
        });
    }
}

function HoldersChartButton() {
    const target = document.querySelector('.p-show__widget--table:has([data-table-id="holders"]) .u-mb-m');
    const button = document.createElement('div');
    
    button.id ="top-holders-container";
        button.innerHTML =
            '<div class="svgBtn-disabled" id="holders-svg-button1" data-tooltip2="Top Holders by Supply">' +
                '<svg width="18px" height="18px" viewBox="0 0 1024 1024" fill="#8D93B7" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M521.58 516.763v-472.816c250.725 22.642 450.175 222.092 472.817 472.817h-472.816zM918.229 593.091h-435.436c-21.963 0-39.769-17.805-39.769-39.769 0 0 0 0 0 0v-435.463c-222.914 20.121-397.682 207.273-397.682 435.436 0 241.605 195.898 437.452 437.451 437.451 228.163 0 415.339-174.715 435.436-397.657z" /></svg>' +
            '</div>' +
            '<div class="svgBtn-disabled" id="holders-svg-button2" data-tooltip2="Top Holders by Type">' +
                '<svg width="18px" height="18px" viewBox="0 0 16 16" fill="#8D93B7" class="icon" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H12V15H16V1Z" /><path d="M6 5H10V15H6V5Z" /><path d="M0 9H4V15H0V9Z" /></svg>' +
            '</div>';

    if (target && !document.getElementById("top-holders-container"))
    {
        target.appendChild(button);
        setTimeout(() => {
            const svgBtn1 = document.getElementById('holders-svg-button1');
            const svgBtn2 = document.getElementById('holders-svg-button2');
            if(svgBtn1)
                svgBtn1.classList.remove('svgBtn-disabled');
            if(svgBtn2)
                svgBtn2.classList.remove('svgBtn-disabled');
        }, 5000);
    }
    TooltipPhoton2();
}

function MakeHoldersChartDivs1() {
    const parentDiv = document.getElementById('holders-popup-container1');
    const svgIcon = document.querySelector('#holders-svg-button1 svg path');
    
    if (!parentDiv) {
        const target = document.querySelector('.p-show__widget--table:has([data-table-id="holders"]) .u-mb-m');
        const popup = document.createElement('div');
        popup.id = "holders-popup-container1";
        popup.innerHTML =
        '<div class="holders-popup1">' +
        '<span class="top-100-holders-title">Top Holders by Supply</span>' +
            '<div id="holders-chartdiv1"></div>' +
        '</div>';
        target.appendChild(popup);
        ChartHolders1();
        divsCreated = true;
        //svgIcon.setAttribute("fill", "#f0ffb2");
        svgIcon.setAttribute("fill", "#8E9DFF");
        svgIcon.style.filter = "drop-shadow(0px 0px 4px #8E9DFF)";
                setTimeout(() => {
                popup.classList.add('show');
            }, 10);
    } else {
        DeleteHoldersChartDivs1();
    }
}

function MakeHoldersChartDivs2() {
    const parentDiv = document.getElementById('holders-popup-container2');
    const svgIcon = document.querySelector('#holders-svg-button2 svg');
    
    if (!parentDiv) {
        const target = document.querySelector('.p-show__widget--table:has([data-table-id="holders"]) .u-mb-m');
        const popup = document.createElement('div');
        popup.id = "holders-popup-container2";
        popup.innerHTML =
        '<div class="holders-popup2">' +
        '<span class="top-100-holders-title">Top Holders by Type</span>' +
            '<div id="holders-chartdiv2"></div>' +
        '</div>';
        target.appendChild(popup);
        ChartHolders2();
        divsCreated = true;
        //svgIcon.setAttribute("fill", "#f0ffb2");
        svgIcon.setAttribute("fill", "#8E9DFF");
        svgIcon.style.filter = "drop-shadow(0px 0px 4px #8E9DFF)";
                setTimeout(() => {
                popup.classList.add('show');
            }, 10);
    } else {
        DeleteHoldersChartDivs2();
    }
}

function DeleteHoldersChartDivs1() {
    const divDel1 = document.getElementById('holders-popup-container1');
    const svgIcon = document.querySelector('#holders-svg-button1 svg path');
    if (divDel1) {
        divDel1.classList.remove('show');
        svgIcon.setAttribute("fill", "#8D93B7");
        svgIcon.style.filter = "none";
        setTimeout(() => {
            const divDel1Check = document.getElementById('holders-popup-container1');
            if (divDel1Check && divDel1Check.parentNode) {
                divDel1Check.parentNode.removeChild(divDel1Check);
            }
            divsCreated = false;
        }, 350);
    }
}

function DeleteHoldersChartDivs2() {
    const divDel2 = document.getElementById('holders-popup-container2');
    const svgIcon = document.querySelector('#holders-svg-button2 svg');
    if (divDel2) {
        divDel2.classList.remove('show');
        svgIcon.setAttribute("fill", "#8D93B7");
        svgIcon.style.filter = "none";
        setTimeout(() => {
            const divDel2Check = document.getElementById('holders-popup-container2');
            if (divDel2Check && divDel2Check.parentNode) {
                divDel2Check.parentNode.removeChild(divDel2Check);
            }
            divsCreated = false;
        }, 350);
    }
}

function ChartHolders1() {
    updateValues();
    
    var root = am5.Root.new("holders-chartdiv1");
    root.setThemes([am5themes_Animated.new(root)]);
    
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
    }));
    
    var series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false
    }));
    
    var bgColor = root.interfaceColors.get("background");
    
    series.slices.template.setAll({
        stroke: am5.color(0x1e2028),
        strokeOpacity: 0,
        strokeWidth: 5
    });
    
    series.slices.template.states.create("hover", { scale: 1.06 });
    series.labels.template.set("text", "[#fff]{category}: {value.formatNumber('#,#')}");
    series.slices.template.set("tooltipText", "[#F2F5F9]{category}: {value.formatNumber('#.##p')}");
    
    var tooltip = am5.Tooltip.new(root, { getFillFromSprite: false });

    tooltip.get("background").setAll({
        fill: am5.color(0x000),
        fillOpacity: 0.9,
        strokeOpacity: 0
    });

    series.set("tooltip", tooltip);
    
    series.labels.template.set("forceHidden", true);
    series.set("text", am5.color(0xff0000));
    series.slices.template.setAll({templateField: "sliceSettings"});
    
    series.data.setAll([
      { value: Happy, category: "Users", sliceSettings: { fill: am5.color(0xf0ffb2) } },
      { value: Others, category: "Bots", sliceSettings: { fill: am5.color(0x98a36a) } },
      { value: Snipe, category: "Snipers", sliceSettings: { fill: am5.color(0x747ac4) } },
      { value: Ghost, category: "Insiders", sliceSettings: { fill: am5.color(0x6369ad) } },
      { value: Dev, category: "Dev", sliceSettings: { fill: am5.color(0x7c53a3) } },
      { value: Pool, category: "LP", sliceSettings: { fill: am5.color(0x3d3f4f) } }
    ]);

    var legend = chart.children.push(am5.Legend.new(root, {
        layout: am5.GridLayout.new(root, {
            maxColumns: 3,
            fixedWidthGrid: true
        }),
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 10,
        marginBottom: 15,
    }));
    
    legend.labels.template.setAll({
        fontSize: 13,
        fontWeight: "600",
        fill: "#fff"
    });
    
    legend.markers.template.setAll({
        width: 16,
        height: 16,
        strokeOpacity: 0
    });
    
    legend.valueLabels.template.set("forceHidden", true);
    legend.data.setAll(series.dataItems);
    series.appear(1000, 100);
    root._logo.dispose();
    resetValues();
}

function ChartHolders2() {
    updateValues();
    
    var root = am5.Root.new("holders-chartdiv2");
    root.setThemes([am5themes_Animated.new(root)]);
    
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
    }));
    
    var series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false
    }));
    
    var bgColor = root.interfaceColors.get("background");
    
    series.slices.template.setAll({
        stroke: am5.color(0x1e2028),
        strokeOpacity: 0,
        strokeWidth: 5
    });
    
    series.slices.template.states.create("hover", { scale: 1.06 });
    series.labels.template.set("text", "[#fff]{category}: {value.formatNumber('##')}");
    series.slices.template.set("tooltipText", "[#F2F5F9]{category}: {value.formatNumber('###')}");
    
    var tooltip = am5.Tooltip.new(root, { getFillFromSprite: false });

    tooltip.get("background").setAll({
        fill: am5.color(0x000),
        fillOpacity: 0.9,
        strokeOpacity: 0
    });

    series.set("tooltip", tooltip);
    
    series.labels.template.set("forceHidden", true);
    series.set("text", am5.color(0xff0000));
    series.slices.template.setAll({templateField: "sliceSettings"});
    
    series.data.setAll([
        { value: Shrimps, category: "Shrimps", sliceSettings: { fill: am5.color(0x4538bb) } },
        { value: Fish, category: "Fish", sliceSettings: { fill: am5.color(0x694eba) } },
        { value: Sharks, category: "Sharks", sliceSettings: { fill: am5.color(0xa364b7) } },
        { value: Whales, category: "Whales", sliceSettings: { fill: am5.color(0xd074b8) } }
    ]);

    var legend = chart.children.push(am5.Legend.new(root, {
        layout: am5.GridLayout.new(root, {
            maxColumns: 2,
            fixedWidthGrid: true,
            useDefaultMarker: true
        }),
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 10,
        marginBottom: 15,
    }));
    
    legend.labels.template.setAll({
        fontSize: 13,
        fontWeight: "600",
        fill: "#fff"
    });
    
    legend.markers.template.setAll({
        width: 16,
        height: 16,
        strokeOpacity: 0
    });

    legend.valueLabels.template.set("forceHidden", true);
    legend.data.setAll(series.dataItems);
    
    series.appear(1000, 100);
    root._logo.dispose();
    resetValues();
}

function HoldersButtonTooltip() {
    const tooltip = document.createElement("div");
    tooltip.className = "holders-tooltip";
    document.body.appendChild(tooltip);

    let showTimeout, hideTimeout;

    document.querySelectorAll("[data-tooltip]").forEach(elem => {
        elem.addEventListener("mouseenter", function() {
            clearTimeout(hideTimeout);

            showTimeout = setTimeout(() => {
                tooltip.textContent = this.dataset.tooltip;
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + window.scrollX + "px";
                tooltip.style.top = rect.bottom + window.scrollY + "px";
                tooltip.style.display = "block";
            }, 150);
        });

        elem.addEventListener("mouseleave", function() {
            clearTimeout(showTimeout);

            hideTimeout = setTimeout(() => {
                tooltip.style.display = "none";
            }, 150);
        });
    });
}

function observeHoldersChartsButton() {
    function startObserving() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const holdersTabElement = document.querySelector(".Baij3c8abbY_PzZUTQMw.e2Ijl9d4hDT4JrWnn5g1:nth-child(4)");
                const target = document.querySelector(
                    'div[id^="ShowPageContainer"] .u-custom-scroll.c-trades-table-wrapper.u-overflow-x-auto ' +
                    '.c-trades-table__thead.c-grid-table__head .c-grid-table__th.c-trades-table__th:nth-child(5)'
                );

                if (holdersTabElement && !holdersTabPresent && target) {
                    HoldersChartButton();
                    HoldersButtonTooltip();

                    const holdersBTN1 = document.getElementById("holders-svg-button1");
                    const holdersBTN2 = document.getElementById("holders-svg-button2");

                    if (holdersBTN1 && holdersBTN2) {
                        holdersBTN1.addEventListener('click', MakeHoldersChartDivs1);
                        holdersBTN2.addEventListener('click', MakeHoldersChartDivs2);

                        document.addEventListener('click', (event) => {
                            if (divsCreated && !event.target.closest('#holders-svg-button1')) {
                                DeleteHoldersChartDivs1();
                            }
                        });

                        document.addEventListener('click', (event) => {
                            if (divsCreated && !event.target.closest('#holders-svg-button2')) {
                                DeleteHoldersChartDivs2();
                            }
                        });
                    }

                    holdersTabPresent = true;
                } else if (!holdersTabElement && holdersTabPresent) {
                    holdersTabPresent = false;
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.body) {
        startObserving();
    } else {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                startObserving();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
}

function HoldersTabSetHeight() {
    const targetSelector = ".Baij3c8abbY_PzZUTQMw.e2Ijl9d4hDT4JrWnn5g1:nth-child(4)";
    const sourceSelector = ".c-sortable.c-grid-table__body";
    const targetHeightSelector = ".c-trades-table__scroll";

    function updateHeight() {
        const targetElement = document.querySelector(targetSelector);
        const sourceElement = document.querySelector(sourceSelector);
        const targetHeightElement = document.querySelector(targetHeightSelector);

        if (targetElement && sourceElement && targetHeightElement) {
            const height = window.getComputedStyle(sourceElement).height;
            if (targetHeightElement.style.maxHeight !== height) {
                targetHeightElement.style.maxHeight = height;
            }
        }
    }

    function startObserving() {
        const observer = new MutationObserver((mutations, obs) => {
            updateHeight();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Run once in case elements are already loaded
        updateHeight();
    }

    if (document.body) {
        startObserving();
    } else {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                startObserving();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
}

// HOLDERS SOL BALANCE
const balanceCache = new Map();
let isProcessing = false;
let rowsObserver;
let tabObserver;

function extractWalletAddress(url) {
    const parts = url.split('/account/');
    return parts.length > 1 ? parts[1] : null;
}

async function processRow(row, delay) {
    const anchor = row.querySelector('a[href^="https://solscan.io/account/"]');
    if (!anchor) return;

    const walletAddress = extractWalletAddress(anchor.href);
    if (!walletAddress) return;

    if (balanceCache.has(walletAddress)) {
        updateRowWithBalance(row, balanceCache.get(walletAddress));
        return;
    }

    updateRowWithBalance(row, "0.00");

    await new Promise(resolve => setTimeout(resolve, delay));

    try {
        const balance = await getHoldersSolanaBalance(walletAddress);
        const solPrice = await GetPrice();
        const usdBalance = solPrice && balance ? (balance * solPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';


        const displayBalance = balance !== null
            ? `${balance}<span class="holders-sol-balance"> ≡</span><span class="holders-usd-balance"> $${usdBalance}</span>`
            : '<span class="holders-sol-balance">N/A</span>';

        balanceCache.set(walletAddress, displayBalance);
        updateRowWithBalance(row, displayBalance);
    } catch (error) {
        console.log(`Couldn't get balance for: ${walletAddress}:`, error);
        updateRowWithBalance(row, "N/A");
    }
}

function updateRowWithBalance(row, balance) {
    let balanceCell = row.querySelector('.balance-cell');
    if (!balanceCell) {
        balanceCell = document.createElement('div');
        balanceCell.className = 'c-grid-table__td c-trades-table__td balance-cell';
        row.insertBefore(balanceCell, row.firstChild);
    }
    balanceCell.innerHTML = `<div class="u-text-left u-color-light-alt">${balance}</div>`;
}

function addBalanceHeader() {
    const headerRow = document.querySelector('.c-grid-table[data-table-id="holders"] .c-grid-table__head');
    if (!headerRow || headerRow.querySelector('.balance-header')) return;

    const balanceHeader = document.createElement('div');
    balanceHeader.className = 'c-grid-table__th c-trades-table__th balance-header';
    balanceHeader.innerHTML = '<div class="u-d-flex u-align-items-center">Balance</div>';

    headerRow.insertBefore(balanceHeader, headerRow.firstChild);
}

function addDefaultBalanceCells(container) {
    const rows = container.querySelectorAll('.c-grid-table__tr:not(.processed)');
    rows.forEach(row => {
        if (!row.querySelector('.balance-cell')) {
            updateRowWithBalance(row, '-.-- <span class="holders-sol-balance"> ' + String.fromCharCode(8801) + '</span>' );
        }
    });
}

async function processCurrentRows(container) {
    if (isProcessing) return;
    isProcessing = true;

    try {
        const rows = container.querySelectorAll('.c-grid-table__tr:not(.processed)');
        if (!rows.length) return;

        addDefaultBalanceCells(container);

        for (let i = 0; i < rows.length; i++) {
            rows[i].classList.add('processed');
            await processRow(rows[i], 35);
        }
    } finally {
        isProcessing = false;
    }
}

function handleRowsMutation(mutations) {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('c-grid-table__tr')) {
                updateRowWithBalance(node, "Fetching...");
                processRow(node, 75);
            }
        });
    });
}

function initializeHoldersTable() {
    const container = document.querySelector('.c-grid-table[data-table-id="holders"] .c-sortable.c-grid-table__body');
    if (!container) return false;

    addBalanceHeader();
    addDefaultBalanceCells(container);

    if (!rowsObserver) {
        rowsObserver = new MutationObserver(handleRowsMutation);
        rowsObserver.observe(container, { childList: true, subtree: false });
    }

    processCurrentRows(container);
    return true;
}

function waitForHoldersTab(callback) {
    if (document.body) {
        callback();
    } else {
        new MutationObserver((mutations, observer) => {
            if (document.body) {
                observer.disconnect();
                callback();
            }
        }).observe(document.documentElement, { childList: true });
    }
}

function watchForHoldersTab() {
    if (tabObserver) return; // Prevent multiple observers

    tabObserver = new MutationObserver(() => {
        const holdersTab = document.querySelector('.c-grid-table[data-table-id="holders"]');
        if (holdersTab && holdersTab.offsetParent !== null) { // Ensure it's visible
            initializeHoldersTable(); // Reinitialize balances when the tab is visible
        }
    });

    tabObserver.observe(document.body, { childList: true, subtree: true });
}

async function getHoldersSolanaBalance(walletAddress) {
    const baseUrl = 'https://lb.drpc.org/ogrpc?network=solana&dkey=';
    const apiKeys = [
        'AjCfLU79IkOVpRw570wVdXLt6UtJQfkR8IEp7sROl9Tz',
        'AqdrIoawIElbtkuJa9TGkAcwL3jsCEER8I9FssvAG40d',
        'AqZ-jbpSs05fmwqvQqE9sJqkyykQQgQR8JruxpZiEquA',
        'AogqWSqkAEIkniRDNm4FcOeACwTUHfkR8LTWFoHUp5S4'
    ];

    const shuffledKeys = [...apiKeys].sort(() => Math.random() - 0.5);
    
    const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [walletAddress],
    };

    let lastError = null;
    
    // Try each key in random order until one succeeds
    for (const key of shuffledKeys) {
        try {
            const response = await fetch(baseUrl + key, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(`RPC Error: ${data.error.message}`);
            }
            
            return (data.result.value / 1_000_000_000).toFixed(2);
        } catch (error) {
            lastError = error;
            console.log("Error fetching Holders's SOL balance:", error.message || error);
            // Continue to next key
        }
    }

    return null;
}

/*if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchForHoldersTab);
} else {
    watchForHoldersTab();
}*/

// MIGRATING TOKENS WINDOWS NOTIFICATION
let notificationsObserving = false;

function startNotifications() {
    if (notificationsObserving) return; // Prevent multiple observers
    notificationsObserving = true;
    GraduatedNotifications.observe(document.body, { childList: true, subtree: true });
}

function stopNotifications() {
  notificationsObserving = false;
  GraduatedNotifications.disconnect();
}

const GraduatedNotifications = new MutationObserver((mutations) => {
  if (!notificationsObserving) return;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === 1 &&
          (node.matches(".sBVBv2HePq7qYTpGDmRM") || node.querySelector(".sBVBv2HePq7qYTpGDmRM"))
        ) {
          const container = document.querySelector(".IkXVawB0ALMCnMdJvOFY:nth-child(3)");
          const topPumpCard = container.querySelector(".sBVBv2HePq7qYTpGDmRM");
          if (node === topPumpCard || node.querySelector(".sBVBv2HePq7qYTpGDmRM") === topPumpCard) {

            const linkElement = topPumpCard.querySelector(".kZ551pEiiCmBLd2UhVP_")?.getAttribute("href")?.split("lp/").pop().split("?")[0];
            const titleElement = topPumpCard.querySelector(".siDxb5Gcy0nyxGjDtRQj")?.textContent.trim();
            const descriptionElement = topPumpCard.querySelector(".fsYi35goS5HvMls5HBGU")?.textContent.trim();
            const imageElement = topPumpCard.querySelector("img.vGEynuWTSwDcOmw9G8zx")?.src;
            const timeElement = topPumpCard.querySelector("span.PexxssXyjdhtFKu0KhLw")?.textContent;
            const title = titleElement + " just migrated.";

            if (linkElement) {
              chrome.storage.local.get("MigratingTokens", (data) => {
                const migratingTokens = data.MigratingTokens || {};

                if (!Object.values(migratingTokens).includes(linkElement)) {
                  const newKey = Object.keys(migratingTokens).length;
                  migratingTokens[newKey] = linkElement;

                  chrome.storage.local.set({ MigratingTokens: migratingTokens }, () => {
                    //NotifyMigrating(title, descriptionElement, imageElement);
                    NotifyMigrating(title, descriptionElement, imageElement || undefined);
                  });
                }
              });
            }
          }
        }
      });
    }
  });
});

let notifiyEnabled = null;

function CheckMigratingNotifications() {
    chrome.storage.local.get("MigratingNotifications", function (result) {
        if (result.MigratingNotifications) {
            notifiyEnabled = true;
            setTimeout(startNotifications, 1000);
        } else {
            notifiyEnabled = false;
            setTimeout(stopNotifications, 500);
        }
    });
}

function NotifyMigrating(title, description, image) {
    if (!window.Notification) {
    } else if (Notification.permission === "granted") {
        setTimeout(() => {
            new Notification(title, { body: description, icon: image });
        }, 450);
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: description, icon: image });
            } else {
                console.log("User blocked notifications.");
            }
        }).catch(console.log());
    }
}

function deleteLocalStorageMigratingTokens() {
    chrome.storage.local.get("MigratingTokens", data => {
        let migratingTokens = data.MigratingTokens || {};

        if (Object.keys(migratingTokens).length > 100) {
            migratingTokens = {};
            chrome.storage.local.set({ MigratingTokens: migratingTokens }, () => {
            });
        }
    });
}

// MAIN
if ( window.location.hostname == "https://photon-sol.tinyastro.io" && window.location.href.includes('/en/lp/') ) {
    HoldersTabSetHeight();
    observeHoldersChartsButton();
    waitForHoldersTab(watchForHoldersTab);
}

window.onload = async () => {
    const tooltipPhoton2 = document.createElement("div");
    tooltipPhoton2.className = "remastered-tooltip";
    tooltipPhoton2.id = "rem-tooltip-photon";
    if(!document.getElementById('rem-tooltip-photon')) {
        document.body.appendChild(tooltipPhoton2);
    }
    TooltipPhoton2();
    deleteLocalStorageMigratingTokens();
        
    if ( window.location.pathname == '/en/memescope' )
    {
        CheckMigratingNotifications();
    }

    SolPrice();
};

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "local") {
        if ("MigratingNotifications" in changes) {
            CheckMigratingNotifications();
        }
    }
});