import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
// import Button from 'react-bootstrap/Button'
import axios from 'axios'
import apiUrl from './../../apiConfig'

class Post extends Component {
  constructor () {
    super()

    this.state = {
      post: null
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/posts/${this.props.match.params.id}`)
      this.setState({ post: res.data.post })
    } catch (error) {
      this.props.alert({ heading: 'Error',
        message: 'Oops! Something went wrong.',
        variant: 'danger'
      })
    }
  }

  render () {
    const { post } = this.state
    const { user } = this.props

    const menuJsx = (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )

    return (
      <div className="post-wrapper">
        {post && (
          <Fragment>
            <Card style={{ width: '75%' }}>
              <Card.Img variant="top" src={post.url} />
              <Card.Body>
                {user && user._id === post.owner ? menuJsx : ''}
                <Card.Text>
                  {post.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Fragment>
        )}
      </div>
    )
  }
}

export default withRouter(Post)
