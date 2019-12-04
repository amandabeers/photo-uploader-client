import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
// import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import apiUrl from './../../apiConfig'

class Post extends Component {
  constructor () {
    super()

    this.state = {
      post: null,
      showDelete: false,
      showEdit: false,
      editCaption: ''
    }
  }

  componentDidMount () {
    this.loadPost()
  }

  loadPost = async () => {
    try {
      const res = await axios(`${apiUrl}/posts/${this.props.match.params.id}`)
      const editCaption = res.data.post.description ? res.data.post.description : ''
      this.setState({ post: res.data.post, editCaption: editCaption })
      console.log(this.state)
    } catch (error) {
      this.props.alert({ heading: 'Error',
        message: 'Oops! Something went wrong.',
        variant: 'danger'
      })
    }
  }

  deletePost = async () => {
    try {
      await axios({
        url: `${apiUrl}/posts/${this.state.post._id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Token token=${this.props.user.token}`
        }
      })
      this.setState({ showDelete: false })
      this.props.alert({ heading: 'Success!',
        message: 'Your post has been deleted',
        variant: 'success'
      })
      this.props.history.push('/')
    } catch (error) {
      this.props.alert({ heading: 'Error',
        message: 'Oops! Something went wrong.',
        variant: 'danger'
      })
    }
  }

  handleChange = (event) => {
    this.setState({ editCaption: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { editCaption, post } = this.state
    console.log(editCaption)
    axios({
      url: `${apiUrl}/posts/${post._id}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Token token=${this.props.user.token}`
      },
      data: {
        post: {
          description: editCaption
        }
      }
    })
      .then(res => this.setState({ showEdit: false }))
      .then(this.loadPost)
      .catch(res => {
        this.props.alert({ heading: 'Error',
          message: 'Oops! Something went wrong.',
          variant: 'danger'
        })
      })
  }

  render () {
    const { post, showDelete, showEdit } = this.state
    const { user } = this.props

    const handleCloseDelete = () => this.setState({ showDelete: false })
    const handleShowDelete = () => this.setState({ showDelete: true })

    const handleCloseEdit = () => this.setState({ showEdit: false, editCaption: post.description })
    const handleShowEdit = () => this.setState({ showEdit: true })

    const editJsx = (
      <Card.Footer>
        <small className="text-muted postActions" onClick={handleShowEdit}>Edit</small>
        <small className="text-muted postActions"> | </small>
        <small className="text-muted postActions" onClick={handleShowDelete}>Delete</small>
      </Card.Footer>
    )

    return (
      <div>
        <div className="post-wrapper">
          {post && (
            <Fragment>
              <Card style={{ width: '50%' }}>
                <Card.Img variant="top" src={post.url} />
                <Card.Body>
                  <Card.Text>
                    {post.description}
                  </Card.Text>
                </Card.Body>
                {user && user._id === post.owner ? editJsx : ''}
              </Card>
            </Fragment>
          )}

          {post && (
            <Fragment>
              <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this post?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDelete}>
                    No
                  </Button>
                  <Button variant="primary" onClick={this.deletePost}>
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={showEdit} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="description">
                      <Form.Label>Edit Caption</Form.Label>
                      <Form.Control
                        name="description"
                        type="text"
                        as="textarea"
                        rows="3"
                        placeholder="Caption"
                        value={this.state.editCaption}
                        onChange={this.handleChange}
                        required
                      />
                    </Form.Group>
                    <Button variant="secondary" className="mr-2" onClick={handleCloseEdit}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                      Update
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </Fragment>
          )}
        </div>

        <p className="mt-3 text-center"><Link to='/'>Back to all posts</Link></p>
      </div>
    )
  }
}

export default withRouter(Post)
