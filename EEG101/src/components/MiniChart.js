// MiniChart.js
// A small Victory Chart that can open up a modal when clicked

import React, { Component } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryAxis
} from "victory-native";

export default class MiniChart extends Component {
  constructor(props) {
    super(props);
  }

  getFeatureRanks(electrode, data) {
    const lowBound = (electrode - 1) * 4;
    const highBound = electrode * 4;
    const featureArray = [0];

    Array.from(data).forEach((val, i) => {
      if (val >= lowBound && val < highBound) {
        featureArray[val % 4] = i;
      }
    });
    return featureArray;
  }

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#ffffff",
          height: this.props.height,
          width: this.props.width,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Text
            style={{
              position: "absolute",
              left: -20,
              fontWeight: "100",
              color: "#000000",
              fontFamily: "Roboto-Light",
              fontSize: 9,
              transform: [{ rotate: "270deg" }]
            }}
          >
            {" "}Feature Rank
          </Text>
          <VictoryChart
            width={this.props.width}
            height={this.props.height - 50}
            padding={{ bottom: 30, top: 10, right: 10, left: 30 }}
            style={{ labels: { fontSize: 10 } }}
          >
            <VictoryAxis
              style={{
                axis: {
                  stroke: "none"
                },
                tickLabels: { fontSize: 10 }
              }}
              tickValues={[0, 1, 2, 3]}
              tickFormat={["δ", "θ", "α", "β"]}
            />
            <VictoryAxis
              dependentAxis={true}
              tickValues={[1, 15]}
              tickFormat={["16th", "1st"]}
              style={{ tickLabels: { fontSize: 9 } }}
            />
            <VictoryLine
              data={this.getFeatureRanks(1, this.props.data)}
              style={{ data: { stroke: "#E86A21" } }}
            />
            <VictoryLine
              data={this.getFeatureRanks(2, this.props.data)}
              style={{ data: { stroke: "#009987" } }}
            />
            <VictoryLine
              data={this.getFeatureRanks(3, this.props.data)}
              style={{ data: { stroke: "#565C9B" } }}
            />
            <VictoryLine
              data={this.getFeatureRanks(4, this.props.data)}
              style={{ data: { stroke: "#D10E89" } }}
            />
          </VictoryChart>
        </View>
        <Image
          source={require("../assets/electrodelegend.png")}
          style={{ width: 150, height: 30 }}
          resizeMode="contain"
        />
      </View>
    );
  }
}
