import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import apiUrl from './../../apiConfig'

class CreatePost extends Component {
  constructor () {
    super()

    this.state = {
      post: {
        file: '',
        description: ''
      }
    }
  }

  handleChange = (event) => {
    this.setState({ post: { ...this.state.post, [event.target.name]: [event.target.value] } })
    // console.log(this.state)
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value)
    // }
    try {
      const res = await axios({
        url: `${apiUrl}/posts`,
        method: 'POST',
        headers: {
          'Authorization': `Token token=${this.props.user.token}`
        },
        data: formData
      })
      this.props.history.push(`/posts/${res.data.post._id}`)
    } catch (error) {
      this.props.alert({ heading: 'Error',
        message: 'Oops! Something went wrong.',
        variant: 'danger'
      })
    }
  }

  render () {
    const { post } = this.state
    return (
      <div>
        <h3 className="text-center mt-2 mb-2">Create a New Post</h3>
        <div className="form-wrapper">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="file" encType="multipart/form-data">
              <Form.Label>Photo Upload</Form.Label>
              <Form.Control
                name="file"
                type="file"
                placeholder="Upload Photo"
                value={post.file}
                onChange={this.handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Photo Caption</Form.Label>
              <Form.Control
                name="description"
                type="text"
                placeholder="Caption"
                value={post.description}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mr-2">
              Submit
            </Button>
            <Button variant="danger" type="button" as="a" href='#'>
              Cancel
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default withRouter(CreatePost)
