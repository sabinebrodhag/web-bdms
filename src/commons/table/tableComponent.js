import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import {
  Table,
  Pagination
} from 'semantic-ui-react'

class TableComponent extends React.Component {
  constructor(props) {
    super(props)
    this.delay = false
    this.uid = _.uniqueId()
    const {
      activeItem,
      filter
    } = this.props
    this.state = {
      activeItem: activeItem !== undefined? activeItem: null,
      filter: filter !== undefined? filter: {}
    }
  }
  componentDidMount(){
    const {
      filter
    } = this.props
    this.props.loadData(1, filter)
  }
  componentDidUpdate(prevProps){
    const {
      filter
    } = this.props
    if(!_.isEqual(filter, prevProps.filter)){
      // delay grid reload waiting for user typing
      if(this.delay){
        clearTimeout(this.delay)
        this.delay = false
      }
      this.delay = setTimeout(function(){
        this.props.loadData(1, filter)
      }.bind(this), 10)
    }
  }
  handleClick(selected) {
    const {
      onSelected
    } = this.props
    if(this.state.activeItem === selected.id){
      if(onSelected!==undefined){
        onSelected(null)
      }
      this.setState({activeItem: null})
    }else{
      if(onSelected!==undefined){
        onSelected(selected)
      }
      this.setState({activeItem: selected.id})
    }
  }

  getHeader(){
    console.error("Please overwrite getHeader method");
  }

  getCols(item, idx){
    console.error("Please overwrite getCols method");
  }

  render() {
    const {
      store,
      filter
    } = this.props, {
      activeItem
    } = this.state
    return (
      <div style={{
          flex: "1 1 0%",
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
        <div style={{
          textAlign: 'center',
          // padding: '0px 1em 0px 1em'
        }}>
          <Table fixed compact='very' basic='very' selectable>
            <Table.Header>
              {this.getHeader()}
            </Table.Header>
          </Table>
        </div>
        <div style={{
            flex: "1 1 0%",
            overflowY: 'auto',
            // border: 'thin solid #d2d2d2',
            // padding: '0px 1em'
          }}>
          <Table fixed compact='very' basic='very' selectable>
            <Table.Body>
            {
              store.data.map((item, idx) => (
                <Table.Row
                  style={{
                    cursor: 'pointer'
                  }}
                  key={this.uid+"_"+idx}
                  active={activeItem === item.id}
                  onClick={e=>this.handleClick(item)}>
                    {
                      this.getCols(item, idx)
                    }
                </Table.Row>
              ))
            }
            </Table.Body>
          </Table>
        </div>
        {
          store.pages > 1?
          <div style={{
            textAlign: 'center',
            padding: '1em 0px 0px 1em'
          }}>
            <Pagination
              secondary
              pointing
              activePage={store.page}
              onPageChange={(ev, data)=>{
                this.props.loadData(data.activePage, filter)
              }}
              totalPages={store.pages}/>
          </div>: null
        }
      </div>
    )
  }
}

TableComponent.propTypes = {
    onSelected: PropTypes.func,
    filter: PropTypes.object,
    loadData: PropTypes.func
}

TableComponent.defaultProps = {
  name: 'Stranger'
}

export default TableComponent