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
import * as colors from "../styles/colors";

export default class MiniChart extends Component {
  constructor(props) {
    super(props);
  }

  getElectrodeData(electrode, data) {
    return data.slice((electrode - 1) * 4, electrode * 4)
  }

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.white,
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
            height={this.props.height - 50}
            padding={{ bottom: 30, top: 10, right: 10, left: 55 }}
            domainPadding={{y:[0,10]}}
            style={{ labels: { fontSize: 10 } }}
          >
            <VictoryAxis
              style={{

                tickLabels: { fontSize: 10 }
              }}
              tickValues={[0, 1, 2, 3]}
              tickFormat={["δ", "θ", "α", "β"]}
            />
            <VictoryAxis
              dependentAxis={true}
              tickCount={4}
              style={{  tickLabels: { fontSize: 9 } }}
            />
            <VictoryLine
              data={this.getElectrodeData(1, this.props.data)}
              style={{ data: { stroke: "#E86A21" } }}
            />
            <VictoryLine
              data={this.getElectrodeData(2, this.props.data)}
              style={{ data: { stroke: "#009987" } }}
            />
            <VictoryLine
              data={this.getElectrodeData(3, this.props.data)}
              style={{ data: { stroke: "#565C9B" } }}
            />
            <VictoryLine
              data={this.getElectrodeData(4, this.props.data)}
              style={{ data: { stroke: "#D10E89" } }}
            />
          </VictoryChart>
        </View>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <Image
          source={require("../assets/electrodelegend.png")}
          style={{ width: 150, height: 30 }}
          resizeMode="contain"
        />
        <Image
          source={require("../assets/electrodediagram.png")}
          style={{ width: 50, height: 50 }}
          resizeMode="contain"
        />
      </View>
      </View>
    );
  }
}
