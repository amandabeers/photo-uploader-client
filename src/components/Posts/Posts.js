import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
// import Button from 'react-bootstrap/Button'
import axios from 'axios'
import apiUrl from './../../apiConfig'

class Posts extends Component {
  constructor () {
    super()

    this.state = {
      posts: []
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/posts`)
      this.setState({ posts: res.data.posts })
    } catch (error) {
      this.props.alert({ heading: 'Error',
        message: 'Oops! Something went wrong.',
        variant: 'danger'
      })
    }
  }

  routeChange = (id) => {
    this.props.history.push(`/posts/${id}`)
  }

  render () {
    const { posts } = this.state

    return (
      <Fragment>
        {posts.length > 0 && (
          <Fragment>
            <CardColumns className="mt-3">
              {posts.map(post => (
                <Fragment key={post._id}>
                  <Card onClick={() => this.routeChange(post._id)}>
                    <Card.Img variant="top" src={post.url} />
                    <Card.Body>
                      <Card.Text>
                        {post.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Fragment>
              ))}
            </CardColumns>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default withRouter(Posts)
