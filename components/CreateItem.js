import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String!
    $largeImage: String!
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  };

  onChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async event => {
    const { files } = event.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'markethub');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/cavdy/image/upload',
      {
        method: 'POST',
        body: data
      }
    );

    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  sumbitForm = async (event, createItem) => {
    event.preventDefault();
    // call the mutation
    const res = await createItem();
    // Redirect them to single item page
    console.log(res);
    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id }
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={event => this.sumbitForm(event, createItem)}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  name="file"
                  type="file"
                  id="file"
                  placeholder="Upload an Image"
                  onChange={this.uploadFile}
                  required
                />
                {this.state.image && (
                  <img
                    src={this.state.image}
                    alt="Upload Preview"
                    width="200"
                  />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  name="title"
                  type="text"
                  id="title"
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.onChange}
                  required
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  name="price"
                  type="number"
                  id="price"
                  placeholder="Price"
                  value={this.state.price}
                  onChange={this.onChange}
                  required
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter a Description"
                  value={this.state.description}
                  onChange={this.onChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
