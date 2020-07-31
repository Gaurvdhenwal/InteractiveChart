import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from "d3";
import { DataService } from './data.service';
import Swal from 'sweetalert2'
import { ServerConncService } from './server-connc.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'scryAnalytics';
  endPoint: { date: Date; close: string; };
  startPoint: { date: Date; close: string; };
  lines: any;
  dataFormated: any = [];

  constructor(private data: DataService,
    private elRef: ElementRef,
    private server:ServerConncService) {

  }
  pointDetail = {}
  margin = { top: 20, right: 20, bottom: 30, left: 50 };
  width = 960 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  chartData;
  comments = []

  ngOnInit() {
    this.connectServer()
   
  }
  ngAfterViewInit() {
    this.generateGraph()

  }
  connectServer(){
   this.server.getMessage()
    .subscribe(msg=>{
      console.log("received refresh command")
     this.getComments();
    })
  }
  generateGraph() {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d.close); });
    // console.log(valueline)
    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#chart-holder").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // .attr('draggable',true)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("assets/data/data.csv").then((data) => {

      // format the data

      this.dataFormated = data.map(value => {
        return { date: new Date(value.Date), close: value.Close }
      })
      this.chartData = this.dataFormated;
      // Scale the range of the data
      x.domain(d3.extent(this.dataFormated, function (d) { return d.date; }));
      y.domain([0, d3.max(this.dataFormated, function (d) { return d.close; })]);

      // Add the valueline path.

      // Add the x Axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      // Add the y Axis
      svg.append("g")
        .call(d3.axisLeft(y));
      this.lines = svg.selectAll("lines")
        .data([this.dataFormated])
        .enter()
        .append("g")


      this.lines.append("path")
        // .data([data])
        // .attr('class','line')
        .attr('style', "color:#000;fill: none !important;stroke:brown; stroke-width:2px")
        .attr("d", valueline)

      this.lines.selectAll("points")
        .data(this.dataFormated)
        .enter()
        .append("line")
        .attr("x1", function (d: any) { return x(d.date) })
        .attr("x2", function (d: any) { return x(d.date) })
        .attr("y1", function (d: any) { return y(d.close); })
        .attr("y2", 400)
        .attr('id', function (d: any) { return d.close })
        .attr("stroke", "black")
        .style("opacity", 0)
        .on("mousedown", (d) => {
          console.log("mouse down", d)
          this.startPoint = d
        })
        .on("mouseup", (d) => {
          console.log("mouse up", d)
          this.endPoint = d;
          this.getUserComment()
        })

      this.getComments()
       
  

    });

  }
  highlightComments() {
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    d3.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d.close); });

    let comments = [...this.comments];
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    x.domain(d3.extent(this.dataFormated, function (d) { return d.date; }));
    y.domain([0, d3.max(this.dataFormated, function (d) { return d.close; })]);
    comments.forEach((element) => {
      console.log(element)
      // let dataRange = completeData.filter(d => {
      //   // console.log(d)
      //   return (d.date >= new Date(element.startDate) && d.date <= new Date(element.endDate));
      // })
      // console.log(dataRange)
       var left = x(new Date(element.startDate));
      var right = x(new Date(element.endDate)); //one more day

      var width = right - left;
      var top = y(element.startData);
      this.lines.selectAll("points")
        .data(this.dataFormated)
        .enter()
        .append("rect")
        .attr('x',left)
        .attr('y',top)
        // .attr('y',10)
        .attr("width", width )
        .attr("height",20)
        .attr("style", "stroke:orange;fill:none;")
        .style("opacity", 1)
    });
  }

  getComments() {
    this.data.getChartData()
      .subscribe((data: any) => {
        console.log(data);
        this.comments = [...data.data];
        this.highlightComments();
      })
  }

  async getUserComment() {

    console.log(`getting user comment Time frame ${this.startPoint.date} - ${this.endPoint.date}`)
    // let dataRange = this.chartData.filter(d=>{
    //   return (d.date >= this.startPoint.date && d.date <= this.endPoint.date)
    // })
    // console.log(dataRange)
    let message = Swal.mixin({

    })
    const { value: comment } = await message.fire({
      title: 'Insert Comment',
      text: `Date range ${this.startPoint.date} -  ${this.endPoint.date}`,
      allowOutsideClick: true,
      showCancelButton: true,
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
      input: 'text',
      inputValue: 'Type comment here',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      },
    })
    if (comment) {
      Swal.fire(`Your comment is ${comment}`)
      let obj = {
        from: this.startPoint.date,
        fromData:this.startPoint.close,
        to: this.endPoint.date,
        toData:this.endPoint.close,
        comment: comment,
      }
      console.log(obj)
      this.data.newComment(obj)
        .subscribe((data) => {
          Swal.fire('Created new comment')
          // this.highlightComments()
          console.log(data)
        }, err => {
          Swal.fire('Error saving comment')
          console.log("err in saving comment", err)
        })
    }
  }
}
