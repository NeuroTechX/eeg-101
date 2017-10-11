// BCIHistoryChart.js
// A dynamic line chart showing the history of BCI outputs

import React, { Component } from "react";
import { View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
} from "victory-native";
import * as colors from "../styles/colors";

export default class BCIHistoryChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.skyBlue,
          height: this.props.height,
          width: this.props.width
        }}
      >
        <VictoryChart
          width={this.props.width}
          height={this.props.height}
          domainPadding={{ y: [50, 50] }}

          padding={{ bottom: 10, top: 10, left: 40, right: 0 }}
          style={{ labels: { fontSize: 10 } }}
        >
          <VictoryAxis
            style={{
              axis: {
                stroke: "none"
              }
            }}
            tickValues={[]}
            tickFormat={[]}
          />
          <VictoryAxis
            dependentAxis={true}
            tickValues={[1, 2]}
            tickFormat={["OFF", "ON"]}
            style={{
              axis: {
                stroke: "none"
              },
              tickLabels: {
                fill: colors.white,
                fontWeight: "light"
              }
            }}
          />
          <VictoryLine
            data={this.props.data}
            style={{ data: { stroke: colors.white } }}
          />
        </VictoryChart>
      </View>
    );
  }
}
