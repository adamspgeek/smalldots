import React, { Component, PropTypes } from 'react'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'

export default class Form extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func,
    children: PropTypes.func.isRequired
  }

  static defaultProps = { initialValues: {} }

  state = { values: this.props.initialValues, touches: [] }

  isPristine = path => {
    if (path) {
      return !this.state.touches.find(touch => touch === path)
    }
    return !this.state.touches.length
  }

  isDirty = path => !this.isPristine(path)

  getValue = path => get(this.state.values, path, '')

  setValue = (path, value) => {
    this.setState({
      values: set(cloneDeep(this.state.values), path, value),
      touches: this.isPristine(path) ? [...this.state.touches, path] : this.state.touches
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.values)
    }
  }

  reset = () => this.setState({ values: this.props.initialValues, touches: [] })

  render() {
    // eslint-disable-next-line
    const { initialValues, children, ...rest } = this.props
    return (
      <form {...rest} onSubmit={this.handleSubmit}>
        {children({
          ...this.state,
          isPristine: this.isPristine,
          isDirty: this.isDirty,
          getValue: this.getValue,
          setValue: this.setValue,
          reset: this.reset
        })}
      </form>
    )
  }
}
