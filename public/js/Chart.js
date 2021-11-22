"use strict";

creaGraficiDashboard(jQuery);

function clickHandler(evt, chart) {
  const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

  if (points.length) {
      const firstPoint = points[0];
      const label = chart.data.labels[firstPoint.index];
      const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
      return label;
  }
}

function f_card(label) {
  const card = document.querySelectorAll('[data-card]');
  if(label) {
    const objDiv = document.getElementById(label);
    card.forEach(c => {
      c.classList.remove("active");
    });
    objDiv.classList.add("active");
  }
  else {
    card.forEach(c => {
      c.classList.add("active");
    });
  }
}

async function creaGraficiDashboard($) {
  try {
    //WidgetChart 1
    const [dataUtenti, legendUtenti] = await widgetChart1();
    const totalUtenti = dataUtenti.map(n => parseInt(n)).reduce((a, b) => a + b, 0)
    document.getElementById("utenti").innerText = totalUtenti;

    const ctx1 = document.getElementById("widgetChart1");
    if (ctx1) {
      const myChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: legendUtenti,
          datasets: [{
            data: dataUtenti,
            borderColor: "white",
            borderWidth: "2",
            backgroundColor: "rgba(255,255,255,.3)",
            hoverBackgroundColor: 'white',       
          }]
        },
        options: {
          cutout: '70%',
          maintainAspectRatio: false,
          plugins: {
              legend: {display: false}
          },
          scales: {
              x: {display: false, beginAtZero: true},
              y: {display: false, beginAtZero: true}
          },
          animation: false
        }
      });

      const w1 = document.getElementById("widgetChart1");
      w1.addEventListener('click', (e) => {
      const label = clickHandler(e, myChart);
      if(label){
        f_card("Gestione-utenti")
        }
        else {
          f_card(null)
        }
      });
    }

    //WidgetChart 2
    const [modelli, nomi] = await widgetChart2();
    const totalModelli = modelli.map(n => parseInt(n)).reduce((a, b) => a + b, 0);
    document.getElementById("modelli").innerText = totalModelli;

    const ctx2 = document.getElementById("widgetChart2");
    if (ctx2) {
      const myChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: nomi,
          datasets: [{
            data: modelli,
            backgroundColor: 'rgba(255,255,255,.3)',
            pointBorderColor: 'white',
            borderWidth: 2,
            hoverBackgroundColor: 'white'
          }]
        },
        options: {
          cutout: '70%',
          maintainAspectRatio: false,
          plugins: {
            legend: {display: false}
          },
          scales: {
            x: {display: false},
            y: {display: false}
          },
          elements: {
            point: {radius: 5, hoverRadius: 10, hoverBorderWidth: 3},
            line: {borderColor: "white", borderWidth: 2},
          },
          animation: false
        }
      });

      const w2 = document.getElementById("widgetChart2");
      w2.addEventListener('click', (e) => {
      const label = clickHandler(e, myChart);
      f_card(label)
      });
    }

    //WidgetChart 3
    const [oggettiBIM, oggettiGIS] = await widgetChart3();
    function sumOggetti(){ 
      const sum = parseInt(oggettiBIM) + parseInt(oggettiGIS);
      return sum;
    }
    const oggetti = sumOggetti();
    document.getElementById("oggetti").innerText = oggetti;

    const ctx3 = document.getElementById("widgetChart3");
    if (ctx3) {
      const myChart = new Chart(ctx3, {
        height: 15,
        type: 'doughnut',
        data: {
          labels: ['BIM', 'GIS'],
          datasets: [
            {
            data: [oggettiBIM, oggettiGIS],
            borderColor: "white",
            borderWidth: 2,
            backgroundColor: "rgba(255,255,255,.3)",
            hoverBackgroundColor: 'white',
          }]
        },
        options: {
          cutout: '70%',
          maintainAspectRatio: false,
          plugins: {
              legend: {display: false}
          },
          scales: {
              x: {display: false},
              y: {display: false, beginAtZero: true}
          },
          animation: false
        }
      });
    
      const w3 = document.getElementById("widgetChart3");
      w3.addEventListener('click', (e) => {
      const label = clickHandler(e, myChart);
      f_card(label);
      });
    }

    //WidgetChart 4
    const ctx4 = document.getElementById("widgetChart4");
    if (ctx4) {
      const myChart = new Chart(ctx4, {
        type: 'doughnut',
        data: {
          labels: ['Controllo', 'Manutenzione regolare', 'Manutenzione correttiva', 'Restauro'],
          datasets: [
            {
              data: [65, 40, 25, 5],
              borderColor: "white",
              borderWidth: 2,
              backgroundColor: "rgba(255,255,255,.3)",
              hoverBackgroundColor: 'white',
            }]
          },
          options: {
            cutout: '70%',
            maintainAspectRatio: false,
            plugins: {
                legend: {display: false}
            },
            scales: {
                x: {display: false},
                y: {display: false, beginAtZero: true}
            },
            animation: false
          }
        });

        const w4 = document.getElementById("widgetChart4");
        w4.addEventListener('click', (e) => {
        const label = clickHandler(e, myChart);
        if(label === "Controllo") {
          f_card(label);
        }
        else if(!label){
          f_card(null);
        }
        else{
          f_card("Intervento");
        }
        });
      }

    }
    catch (error) {
      console.log(error);
    }

  try {

  // Analisi costi
  
  const controllo = '#a8c956'
  const intervento = '#1a4f9c'

  var data1 = [52, 60, 55, 50, 65, 80, 57, 70, 105, 115, 100, 0]
  var data2 = [102, 70, 80, 100, 56, 53, 80, 75, 65, 90]
  var data3 = [13, 27, 15, 42, 23, 25, 10, 12, 13, 25, 17, 0]

  var ctx = document.getElementById("recent-rep-chart");
  if (ctx) {
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        type: 'bar',
        labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Marzo ', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        datasets: [
          {
            label: 'attività',
            type: 'line',
            backgroundColor: 'orange',
            pointBorderColor: 'orange',
            borderRadius: 5,
            borderWidth: 2,
            data: data3
          },
          {
            label: 'Costo previsto (€)',
            type: 'bar',
            backgroundColor: controllo,
            borderRadius: 5,
            data: data1
          },
          {
            label: 'Costo effettivo (€)',
            type: 'bar',
            backgroundColor: intervento,
            borderRadius: 5,
            data: data2
          },
        ]
      },
      
      options: {
        plugins: {
          legend: {display: true, position: 'top',
            font: {size: 12, family: 'Poppins'}},
          responsive: true,
          scales: [{
            x: {display: true, color: 'grey'},
            y: {display: true, color: 'grey'}
          }],
        },
        elements: {
          point: {radius: 5, hitRadius: 10, hoverRadius: 15, hoverBorderWidth: 3},
          line: {backgroundColor: 'grey', borderWidth: 10}
          },
        animations: {
          animation: false,
          tension: {duration: 1000, easing: 'linear', from: 1, to: 0, loop: true}
        }
      }
    });
  }

  }
  catch (error) {
    console.log(error);
  }


  try {
    
    const [dataBIM, tableBIM] = await pieChart1()
    let colorBIM = dataBIM.map(() => (`#${(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)}`))

    //pie chart1

    var ctx = document.getElementById("pieChart1");
    if (ctx) {
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [{
            data: dataBIM,
            backgroundColor: colorBIM,
        }],
      labels: tableBIM,
    },
    
      options: {
        plugins: {
          legend: {display: true, position: 'left'},
        }
      },
      responsive: true
      });
    }

  }
  catch (error) {
    console.log(error);
  }


  try {
    
    const [dataGIS, tableGIS] = await pieChart2()
    let colorGIS = dataGIS.map(() => (`#${(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)}`))

    //pie chart2

    var ctx = document.getElementById("pieChart2");
    if (ctx) {
      ctx.height = 150
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: [{
            data: dataGIS,
            backgroundColor: colorGIS,
        }],

      labels: tableGIS,
        },

        options: {
          plugins: {
            legend: {
              display: false,
              position: 'left'
              },
            }
          },
          responsive: true
      });
    }


  }
  catch (error) {
    console.log(error);
  }


  try {
    //bar chart
    var ctx = document.getElementById("barChart1");
    if (ctx) {
      ctx.height = 150;
      var myChart = new Chart(ctx, {
        type: 'bar',
        defaultFontFamily: 'Poppins',
        data: {
          labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
          datasets: [
            {
              label: "Degrado1",
              data: [65, 59, 80, 81, 56, 55, 40, 14, 66, 44, 43, 23],
              borderColor: "#a8c956",
              borderWidth: 1,
              backgroundColor: "#a8c95615",
              fontFamily: "Poppins"
            },
            {
              label: "Degrado2",
              data: [28, 48, 40, 19, 86, 27, 90, 34, 56, 24, 25, 3],
              borderColor: "#a8c956",
              borderWidth: 1,
              backgroundColor: "#a8c95630",
              fontFamily: "Poppins"
            },
            {
              label: "Degrado3",
              data: [23, 38, 43, 13, 56, 37, 10, 32, 12, 24, 23, 13],
              borderColor: "#a8c956",
              borderWidth: 1,
              backgroundColor: "#a8c95660",
              fontFamily: "Poppins"
            },
            {
              label: "Attività",
              type: 'line',
              data: [8, 8, 10, 9, 16, 27, 0, 4, 6, 24, 2, 3],
              borderColor: "#a8c956",
              backgroundColor: '#a8c956',
              borderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 10,
              pointBackgroundColor: '#a8c956',
              pointHoverBackgroundColor: '#a8c956',
              fontFamily: "Poppins"
            }
          ]
        },
        options: {
          legend: {
            position: 'top',
            labels: {
              fontFamily: 'Poppins'
            }
          },
          scales: {
            x: {
              stacked: false,
            },
            y: {
              stacked: false
            }
          }
        }
      });
    }



    //radar chart
    var ctx = document.getElementById("radarChart1");
    if (ctx) {
      ctx.height = 150;
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ["Degrado1", "Degrado2", "Degrado3","Degrado4", "Degrado5", "Degrado6", "Degrado7"],
          defaultFontFamily: 'Poppins',
          datasets: [
            {
              label: "Muri",
              data: [65, 59, 66, 45, 56, 55, 40],
              borderColor: "#a8c956",
              borderWidth: "1",
              backgroundColor: "#a8c95615",
              pointHighlightStroke: "#a8c956",
              pointBackgroundColor: "#a8c956"
            },
            {
              label: "Tetti",
              data: [28, 12, 40, 19, 63, 27, 87],
              borderColor: "#a8c956",
              borderWidth: "1",
              backgroundColor: "#a8c95615",
              pointHighlightStroke: "#a8c956",
              pointBackgroundColor: "#a8c956"
            },
            {
              label: "Pavimenti",
              data: [20, 58, 55, 15, 86, 25, 10],
              borderColor: "#a8c956",
              borderWidth: "1",
              backgroundColor: "#a8c95615",
              pointHighlightStroke: "#a8c956",
              pointBackgroundColor: "#a8c956"
            },
            {
              label: "Colonne",
              data: [2, 13, 30, 9, 13, 17, 37],
              borderColor: "#a8c956",
              borderWidth: "1",
              backgroundColor: "#a8c95615",
              pointHighlightStroke: "#a8c956",
              pointBackgroundColor: "#a8c956"
            }
          ]
        },
        options: {
          legend: {
            position: 'top',
            labels: {
              fontFamily: 'Poppins'
            }

          },
          scale: {
            ticks: {
              beginAtZero: true,
              fontFamily: "Poppins"
            }
          }
        }
      });
    }


    // polar chart
    var ctx = document.getElementById("polarChart1");
    if (ctx) {
      ctx.height = 150;
      var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          datasets: [{
            data: [15, 18, 6],
            backgroundColor: ["#a8c95615", "#a8c95630", "#a8c95660"],
            borderColor: "#a8c956",
            borderWidth: 1
          }],
          labels: ["Attività1", "Attività2", "Attività3"]
        },
        options: {
          legend: {
            position: 'top',
            labels: {
              fontFamily: 'Poppins'
            }
          },
          responsive: true
        }
      });
    }

  }
  catch (error) {
    console.log(error);
  }

  try {
    //bar chart
    var ctx = document.getElementById("barChart2");
    if (ctx) {
      ctx.height = 150;
      var myChart = new Chart(ctx, {
        type: 'bar',
        defaultFontFamily: 'Poppins',
        data: {
          labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
          datasets: [
            {
              label: "Degrado1",
              data: [65, 59, 80, 81, 56, 55, 40, 14, 66, 44, 43, 23],
              borderColor: "#1a4f9c",
              borderWidth: 1,
              backgroundColor: "#1a4e9c15",
              fontFamily: "Poppins"
            },
            {
              label: "Degrado2",
              data: [28, 48, 40, 19, 86, 27, 90, 34, 56, 24, 25, 3],
              borderColor: "#1a4f9c",
              borderWidth: 1,
              backgroundColor: "#1a4e9c30",
              fontFamily: "Poppins"
            },
            {
              label: "Degrado3",
              data: [23, 38, 43, 13, 56, 37, 10, 32, 12, 24, 23, 13],
              borderColor: "#1a4f9c",
              borderWidth: 1,
              backgroundColor: "#1a4e9c60",
              fontFamily: "Poppins"
            },
            {
              label: "Attività",
              type: 'line',
              data: [8, 8, 10, 9, 16, 27, 0, 4, 6, 24, 2, 3],
              borderColor: "#1a4f9c",
              borderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 10,
              backgroundColor: "#1a4f9c",
              fontFamily: "Poppins"
            }
          ]
        },
        options: {
          legend: {
            position: 'top',
            labels: {
              fontFamily: 'Poppins'
            }

          },
          scales: {
            x: {
              stacked: false,
            },
            y: {
              stacked: false
            }
          }
        }
      }
  )};


    //radar chart
    var ctx = document.getElementById("radarChart2");
    if (ctx) {
      ctx.height = 150;
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ["Degrado1", "Degrado2", "Degrado3","Degrado4", "Degrado5", "Degrado6", "Degrado7"],
          defaultFontFamily: 'Poppins',
          datasets: [
            {
              label: "Muri",
              data: [65, 59, 66, 45, 56, 55, 40],
              borderColor: "#1a4f9c",
              borderWidth: "1",
              backgroundColor: "#1a4e9c15",
              pointHighlightStroke: "#1a4f9c",
              pointBackgroundColor: "#1a4f9c"
            },
            {
              label: "Tetti",
              data: [28, 12, 40, 19, 63, 27, 87],
              borderColor: "#1a4f9c",
              borderWidth: "1",
              backgroundColor: "#1a4e9c15",
              pointHighlightStroke: "#1a4f9c",
              pointBackgroundColor: "#1a4f9c"
            },
            {
              label: "Pavimenti",
              data: [20, 58, 55, 15, 86, 25, 10],
              borderColor: "#1a4f9c",
              borderWidth: "1",
              backgroundColor: "#1a4e9c15",
              pointHighlightStroke: "#1a4f9c",
              pointBackgroundColor: "#1a4f9c"
            },
            {
              label: "Colonne",
              data: [2, 13, 30, 9, 13, 17, 37],
              borderColor: "#1a4f9c",
              borderWidth: "1",
              backgroundColor: "#1a4e9c15",
              pointHighlightStroke: "#1a4f9c",
              pointBackgroundColor: "#1a4f9c"
            }
          ]
        },
        options: {
          legend: {
            position: 'top',
            labels: {
              fontFamily: 'Poppins'
            }

          },
          scale: {
            ticks: {
              beginAtZero: true,
              fontFamily: "Poppins"
            }
          }
        }
      });
    }


    // polar chart
    var ctx = document.getElementById("polarChart2");
    if (ctx) {
      ctx.height = 150;
      var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          datasets: [{
            data: [15, 18, 9,],
            backgroundColor: ["#1a4e9c15", "#1a4e9c30", "#1a4f9c60"],
            borderWidth: "1",
            borderColor: "#1a4f9c"
          }],
          labels: ["Attività1", "Attività2", "Attività3"]
        },
        options: {
          plugins: {
            legend: {
              position: 'top',
              labels: {
                fontFamily: 'Poppins'
              }
            }
          },
          responsive: true
        }
      });
    }

  }
  catch (error) {
    console.log(error);
  }

}

try {
  //progress bar
  const progressbarSimple = $('.js-progressbar-simple');
  progressbarSimple.each(function () {
    const that = $(this);
    let executed = false;
    $('#apriTabDashboard').on('click', function () {

      that.waypoint(function () {
        if (!executed) {
          executed = true;
          /*progress bar*/
          that.progressbar({
            update: function (current_percentage, $this) {
              $this.find('.js-value').html(current_percentage + '%');
            }
          });
        }
      }, {
          offset: 'bottom-in-view'
        });
      });
    });

  //speedometer
  function op(elem){return document.querySelector(elem)}
  function opp(elem){return document.querySelectorAll(elem)}

  const circles = opp(".circle");

  circles.forEach(val=>{
    const numDots=val.getAttribute("dot");
    const markeDots=val.getAttribute("markeDot");
    let pt=''
    const rot=360/numDots;
    for(let a=1; a<= numDots; a++){
      if (a<= markeDots) {
        pt+=`<div class="points animated" style="--i: ${a}; --r: ${rot}deg;"></div>`
      }
      else {
        pt+=`<div class="points" style="--i: ${a}; --r: ${rot}deg;"></div>`
      }
    }
    val.innerHTML=pt;
  });

}
catch (err) {
  console.log(err);
}
