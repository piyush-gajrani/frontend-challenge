import React, { Component, Suspense } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown, List, Card } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

import AvatarList from '@/components/AvatarList';
import Ellipsis from '@/components/Ellipsis';

import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));

const data = [
  { genre: 'Sports', sold: 275, income: 600 },
  { genre: 'Sports', sold: 270, income: 300 },
  { genre: 'Sports', sold: 255, income: 400 },
  { genre: 'Sports', sold: 265, income: 200 },
  { genre: 'Sports', sold: 295, income: 100 },
  { genre: 'Sports', sold: 175, income: 350 },
  { genre: 'Sports', sold: 375, income: 300 },
  { genre: 'Strategy', sold: 115, income: 667 },
  { genre: 'Strategy', sold: 275, income: 600 },
  { genre: 'Strategy', sold: 270, income: 300 },
  { genre: 'Strategy', sold: 255, income: 400 },
  { genre: 'Strategy', sold: 265, income: 200 },
  { genre: 'Strategy', sold: 295, income: 100 },
  { genre: 'Action', sold: 175, income: 350 },
  { genre: 'Action', sold: 375, income: 300 },
  { genre: 'Action', sold: 120, income: 982 },
  { genre: 'Shooter', sold: 350, income: 5271 },
  { genre: 'Shooter', sold: 275, income: 600 },
  { genre: 'Shooter', sold: 270, income: 300 },
  { genre: 'Shooter', sold: 255, income: 400 },
  { genre: 'Shooter', sold: 265, income: 200 },
  { genre: 'Shooter', sold: 295, income: 100 },
  { genre: 'Shooter', sold: 175, income: 350 },
  { genre: 'Shooter', sold: 375, income: 300 },
  
];
const cols = {
  sold: { alias: '销售量' },
  genre: { alias: '游戏种类' }
};

@connect(({ list, chart, loading }) => ({
  chart,
  list,
  loading: loading.effects['chart/fetch'],
}))



class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
        payload: {
          count: 8,
        },
      });
    });
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading, list: { list = [] } } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const cardList = list ? (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.title} src={item.cover} />}
            >
              <Card.Meta
                title={<a>{item.title}</a>}
                description={<Ellipsis lines={2}>{item.subDescription}</Ellipsis>}
              />
              <div className={styles.cardItemContent}>
                <span>{moment(item.updatedAt).fromNow()}</span>

              </div>
            </Card>
          </List.Item>
        )}
      />
    ) : null;


    return (
      <GridContent>        

        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                  visitData2={visitData2}
                  selectDate={this.selectDate}
                  searchData={searchData}
                  dropdownGroup={dropdownGroup}
                />
              </Suspense>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
        </div>

        <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
        <Card
            loading={loading}
            bordered={false}
            title="Projects"
            extra={dropdownGroup}
            style={{ marginTop: 24 }}
          >
        <div className={styles.cardList}>{cardList}</div>
        </Card>
        </Col>
  
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
        
         <Chart data={data} scale={cols}>
      <Axis name="genre" />
      <Axis name="sold" />
      <Legend position="top" dy={-20} />
      <Tooltip />

      <Geom
            type="point"
            position="genre*sold"
            //opacity={0.65}
            color="genre"
            shape={['genre', ['circle', 'square']]}
            size={4}
            tooltip="genre*sold"
          />
    </Chart>
    </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Analysis;
