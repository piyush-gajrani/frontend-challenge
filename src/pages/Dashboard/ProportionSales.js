import React, { memo } from 'react';
import { Row, Col, Card, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { Pie,MiniProgress } from '@/components/Charts';
import Yuan from '@/utils/Yuan';

import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

const { DataView } = DataSet;
    const data = [
    
      {
        group: "Fundtype",
        type: "",
        total: 100,
        
        "Equity": 40,
        "Debt": 60,

      }
    ];
    const dv = new DataView();
    dv.source(data)
      .transform({
        type: "map",

        callback(row) {
          row["Debt"] *= -1;
          row["Equity"] *= -1;
          return row;
        }
      })
      .transform({
        type: "fold",
        fields: [
          
          "Equity",
          "Debt",
        ],
        key: "opinion",
        value: "value",
        retains: ["group", "type"]
      });
    const colorMap = {
      "Debt": "#3561A7",
      "Equity": "#CB2920"
    };
const ProportionSales = memo(
  ({ dropdownGroup, salesType, loading, salesPieData, handleChangeSalesType }) => (
    <Card
      loading={loading}

      bordered={false}

      bodyStyle={{ padding: 24 }}

      style={{ marginTop: 24 }}
    >

      <Pie
        //hasLegend
        subTitle='Your Portfolio'
        total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
        data={salesPieData}
        valueFormat={value => <Yuan>{value}</Yuan>}
        height={270}
        lineWidth={4}
        style={{ padding: '8px 0' }}
        colors={['#0000FF','#4169E1','#0000CD']}
      />
      

      <Chart height={100} data={dv} forceFit>
          <Axis name="type" title={null} labelOffset={5} />
          <Axis
            name="value"
            title={null}
            tickLine={null}
            position="right"
            formatter={function(val) {
              return val + "%";
            }}
          />
          <Coord transpose />
          <Legend />
          <Geom
            type="intervalStack"
            position="type*value"
            color={[
              "opinion",
              function(opinion) {
                return colorMap[opinion];
              }
            ]}
            shape="smooth"
            opacity={0.8}
          />
        </Chart>
    
    </Card>
  )
);

export default ProportionSales;
