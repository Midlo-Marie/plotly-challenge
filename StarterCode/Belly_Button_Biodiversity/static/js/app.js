function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(`/metadata/${sample}`).then((data) => {
      // Use d3 to Select the Panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
      // Use `.html("") to Clear any Existing Metadata
      PANEL.html("");
      // Use `Object.entries` to Add Each Key & Value Pair to the Panel
      // Hint: Inside the Loop, Use d3 to Append New Tags for Each Key-Value in the Metadata
      Object.entries(data).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}:${value}`);
      })
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
    })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    // @TODO: Build a Bubble Chart using the sample data
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    // @TODO: Build a Pie Chart
    let bubbleLayout = {
      margin: { t: 40 },
      // paper_bgcolor: "rgb(190,94,94)",
      paper_bgcolor: "rgb(75, 75, 75)",
      hovermode: "closests",
      title: "Operational Taxonomic Unit (OTU) v. Sample Count",
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Counts"}
    }

    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ]

    Plotly.plot("bubble", bubbleData, bubbleLayout);
    // @TODO: Build a Pie Chart
    let pieData = [
      {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
      
        color: sample_values,
        colorscale: "Bluered",
        type: "pie"
      }
    ];
    
    let pieLayout = {
      margin: { t: 0, l: 0 },
      // plot_bgcolor: [0,rgb(190, 94, 94)],
      paper_bgcolor: "rgb(190,94,94)",
      height: 500,
      width: 400
    };

    Plotly.plot("pie", pieData, pieLayout)
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
