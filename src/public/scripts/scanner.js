function update() {
  data.entries.push({
    amount: 1,
    date: new Date('01/01/2024 19:00')
  });

  const { hours, entries, calculations } = generateDatasets(data);
  const newData = createChartData(hours, entries, calculations);
  mixedChart.data = newData;
  mixedChart.update();
}

function onScanSuccess(decodedText, decodedResult) {
  console.log(decodedResult);
  console.log(decodedText);
}

let config = {
  fps: 10,
  qrbox: { width: 200, height: 200 },
  rememberLastUsedCamera: true,
  // Only support camera scan type.
  supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
};

let html5QrcodeScanner = new Html5QrcodeScanner('reader', config, /* verbose= */ false);
html5QrcodeScanner.render(onScanSuccess);
