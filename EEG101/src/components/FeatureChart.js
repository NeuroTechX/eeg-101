// FeatureChart.js
// A chart to help people understand the features in the classifier

import React, { Component } from "react";
import { Image, Text, View,} from "react-native";
import {
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryAxis
} from "victory-native";
import * as colors from "../styles/colors";

export default class MiniChart extends Component {
  constructor(props) {
    super(props);
  }

  getElectrodeData(electrode, data) {
    const electrodeData = data.slice((electrode - 1) * 4, electrode * 4);
    return [{x: "δ", y: electrodeData[0], width: 8}, {x: "θ", y: electrodeData[1], width: 8}, {x: "α", y: electrodeData[2], width: 8}, {x: "β", y: electrodeData[3], width: 8}]
  }

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.white,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between"
          }}
        >
          <Text
            style={{
              position: "absolute",
              left: -20,
              bottom: 75,
              fontWeight: "100",
              color: colors.black,
              fontFamily: "Roboto-Light",
              fontSize: 11,
              transform: [{ rotate: "270deg" }]
            }}
          >
            {" "}Feature Power
          </Text>
          <VictoryChart
            width={this.props.width}
            height={this.props.height -70}
            padding={{ bottom: 30, top: 10, right: 20, left: 55 }}
            domainPadding={{ x: [20,0]}}>
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 11 }
              }}
              tickFormat={["δ", "θ", "α", "β"]}
            />
            <VictoryAxis
              dependentAxis={true}
              tickCount={4}
              style={{  tickLabels: { fontSize: 9 } }}
            />
            <VictoryGroup
              offset={9}
              categories={{x: ["δ", "θ", "α", "β"]}}
              colorScale={["#E86A21", "#009987", "#565C9B", "#D10E89"]}
            >
              <VictoryBar data={this.getElectrodeData(1, this.props.data)} />
              <VictoryBar data={this.getElectrodeData(2, this.props.data)} />
              <VictoryBar data={this.getElectrodeData(3, this.props.data)} />
              <VictoryBar data={this.getElectrodeData(4, this.props.data)} />
            </VictoryGroup>
          </VictoryChart>
        </View>

        <Image
          source={require("../assets/electrodeheadlegend.png")}
          style={{ width: 75, height: 75, marginTop: -20, marginLeft: 55}}
          resizeMode="contain"
        />
      </View>
    );
  }
}
