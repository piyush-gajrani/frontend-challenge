import React, { memo } from 'react';
import { Row, Col, Table, Tooltip, Card, Icon, Collapse } from 'antd';
import { FormattedMessage } from 'umi/locale';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import styles from './Analysis.less';
import NumberInfo from '@/components/NumberInfo';
import { MiniArea } from '@/components/Charts';


const Panel = Collapse.Panel;

const columns = [
  {
    title: <FormattedMessage id="app.analysis.table.positions.name" defaultMessage="Name" />,
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: (
      <FormattedMessage id="app.analysis.table.positions.portfolio" defaultMessage="% of portfolio" />
    ),
    dataIndex: 'keyword',
    key: 'keyword',
    render: text => <a href="/"><Icon type="bar-chart" /></a>,
  },
  {
    title: <FormattedMessage id="app.analysis.table.positions.shares" defaultMessage="Est. value of shares" />,
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: <FormattedMessage id="app.analysis.table.positions.total" defaultMessage="Position total" />,
    dataIndex: 'range',
    key: 'range',
    sorter: (a, b) => a.range - b.range,
    render: (text, record) => (
      <Trend flag={record.status === 1 ? 'down' : 'up'}>
        <span style={{ marginRight: 4 }}>{text}</span>
      </Trend>
    ),
    align: 'right',
  },
];

const TopSearch = memo(({ loading, visitData2, searchData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title={
      <FormattedMessage id="app.analysis.table.positions.title" defaultMessage="Positions" />
    }
    extra={dropdownGroup}
    style={{ marginTop: 24 }} 
  >
    {/* <Row gutter={68}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              <FormattedMessage id="app.analysis.search-users" defaultMessage="search users" />
              <Tooltip
                title={<FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />}
              >
                <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
          gap={8}
          total={numeral(12321).format('0,0')}
          status="up"
          subTotal={17.1}
        />
        <MiniArea line height={45} data={visitData2} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              <FormattedMessage
                id="app.analysis.per-capita-search"
                defaultMessage="Per Capita Search"
              />
              <Tooltip
                title={<FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />}
              >
                <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
          total={2.7}
          status="down"
          subTotal={26.2}
          gap={8}
        />
        <MiniArea line height={45} data={visitData2} />
      </Col>
    </Row> */}
    <Collapse bordered={false} defaultActiveKey={['1']}>
    <Panel header="Real estate offerings" key="1">
    <Table
      rowKey={record => record.index}
      size="small"
      columns={columns}
      dataSource={searchData}
      pagination={false}
    />
    </Panel>
    <Panel header="Fundrise iPO" key="2">
    </Panel>
    </Collapse>
  </Card>
));

export default TopSearch;
