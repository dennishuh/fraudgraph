import React, { Component } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend
} from 'react-vis';
import Slider from 'rc-slider';
import dayjs from 'dayjs';
import TextField from '@material-ui/core/TextField';

import { activeCards, amountLoss } from '../data/loss';
import { convertToBarGraph, getMin, onlyNumbers } from '../helpers/dataHelpers';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const activeXY = convertToBarGraph(activeCards);
const lossXY = convertToBarGraph(amountLoss);
const lowestY = getMin(onlyNumbers(activeXY, lossXY));

export default class Chart extends Component {
  state = {
    activeXY,
    lossXY,
    lowestAmount: lowestY,
    lowDate: activeXY[0].x,
    highDate: activeXY[activeXY.length - 1].x
  }

  convertToYearMonthFromUnix([low, high]) {
    return [dayjs.unix(low).format('YYYY-MM'), dayjs.unix(high).format('YYYY-MM')]
  }

  getNewRange(data, low, high) {
    return data.filter(current => {
      if (current.date >= low && current.date <= high) {
        return current;
      }
      return null;
    })
  }

  handleChange = (value) => {
    const [lowDate, highDate] = this.convertToYearMonthFromUnix(value);

    const newActiveData = this.getNewRange(activeCards, lowDate, highDate);
    const newLossData = this.getNewRange(amountLoss, lowDate, highDate);
    
    this.setState({
      lowDate,
      highDate,
      activeXY: convertToBarGraph(newActiveData),
      lossXY: convertToBarGraph(newLossData)
    })
  }

  barFraudMouseOver = (datapoint) => {
    this.setState({
      fraud: true,
      currentValue: `$${datapoint.y} Lost`
    })
  }

  barCardAmtMouseOver = (datapoint) => {
    this.setState({
      fraud: false,
      currentValue: `${datapoint.y} Cards`
    })
  }
  
  render() {
    return (
      <div>
        <div style={{ width: '80%', margin: '0 auto' }}>
          <p style={{fontSize: '18px', color: 'rgba(0, 0, 0, 0.54)'}}>Change Date range with slider</p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <TextField
              id="standard-name"
              value={this.state.lowDate}
              disabled
              margin="normal"
            />
            <TextField
              id="standard-name"
              value={this.state.highDate}
              disabled
              margin="normal"
            />
          </div>
          <Range min={dayjs(activeXY[0].x).unix()} max={dayjs(activeXY[activeXY.length-1].x).unix()} defaultValue={[1491022800, 1538370000]} tipFormatter={value => dayjs.unix(value).format('YYYY-MM')} onAfterChange={this.handleChange} />
        </div>
        <div style={{
          textAlign: 'left',
          padding: '50px 0 0 50px',
          color: this.state.fraud ? 'red' : 'green'
        }}>
          <TextField
            id="standard-name"
            value={this.state.currentValue}
            disabled
            margin="normal"
          />
        </div>
        <div>
          <XYPlot
            xType="ordinal"
            width={1100}
            height={900}
            margin={{left: 100}}
          >
            <DiscreteColorLegend
              strokeWidth={40}
              items={[
                {
                  title: 'Active Cards',
                  color: '#54D45C',
                  strokeWidth: 40
                },
                {
                  title: 'Fraud Loss',
                  color: '#AB090F',
                  strokeWidth: 40
                }
              ]}
            />
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis style={{
              line: {stroke: '#ADDDE1'},
              ticks: {stroke: '#ADDDE1'},
              text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600, fontSize: 12}
            }} />
            <YAxis />
            <VerticalBarSeries
              color="#54D45C"
              data={this.state.activeXY}
              y0={this.state.lowestAmount}
              barWidth={.75}
              onValueMouseOver={this.barCardAmtMouseOver}
            />
            <VerticalBarSeries
              color="#AB090F"
              data={this.state.lossXY}
              y0={this.state.lowestAmount}
              barWidth={.75}
              onValueMouseOver={this.barFraudMouseOver}
            />
          </XYPlot>
        </div>
      </div>
      
    );
  }
}
