import React, { useState, useEffect } from "react";
import axios from "axios";
import "./productStyle.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../../App";
import { Cloudinary } from "@cloudinary/url-gen";
import {
  AiFillLike,
  AiOutlineComment,
  AiTwotoneLike,
  AiTwotoneSave,
  AiOutlineClose,
  AiOutlineSend,
  AiFillFolderAdd,
  AiFillDelete,
  AiFillEdit,
} from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { CiUser } from "react-icons/ci";

const cld = new Cloudinary({ cloud: { cloudName: "dofxfblck" } });

const Product = () => {
  const { userId, token, userName } = useContext(userContext);
  const [products, setProduct] = useState([]);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDesciption] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showFrom, setShowFrom] = useState(true);
  const [newPrice, setNewPrice] = useState("");
  const [cartItems, setCartItems] = useState(false);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getAllProduct();
  }, []);

  const getAllProduct = () => {
    axios
      .get("http://localhost:5000/product/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const productWithComment = res.data.product.map((product) => ({
          ...product,
          comments: product.comments || [],
        }));
        setProduct(productWithComment);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteBTN = (id) => {
    if (!products.publisher) {
      axios
        .delete(`http://localhost:5000/product/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          getAllProduct();
        })
        .catch((err) => {
          console.log("ERROR :", err);
        });
    }
  };

  const handleUpdataBTN = (id) => {
    axios
      .put(
        `http://localhost:5000/product/update/${id}`,
        {
          title: newTitle,
          description: newDescription,
          price: newPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUpdateProduct(null);
      })
      .catch((err) => {
        console.log("ERROR :", err);
      });
  };

  const createNewComment = (product_id) => {
    if (!newComment || !product_id) {
      console.log("comment and product fields are required");
      return;
    }
    axios
      .post(
        `http://localhost:5000/comment/add/${product_id}`,
        {
          commenter: userId,
          comment: newComment,
          product: product_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {
        if (res.status === 201) {
          const newComment = res.data.product.comments.pop();
          const updateProduct = products.map((product) => {
            if (product._id === product_id) {
              return {
                ...product,
                comments: product.comments
                  ? [...product.comments, newComment]
                  : [newComment],
              };
            }
            return product;
          });
          setProduct(updateProduct);
          setNewComment("");
        }
      })
      .catch((err) => {
        console.log("ERROR :", err.response || err.message);
      });
  };

  const handleLikeBTN = (id) => {
    if (!userId || !token) {
      console.log("user not authenticated");
      return;
    }
    const likedProduct = products.find((pro) => pro._id === id);

    if (!likedProduct) {
      console.log("product not found");
      return;
    }

    if (likedProduct.likedBy.includes(userId)) {
      console.log("already liked!");
      return;
    }

    axios
      .put(
        `http://localhost:5000/product/like/${id}`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("like response:", res.data);

        const updateProductList = products.map((i) =>
          i._id === id
            ? {
                ...i,
                likes: res.data.product.likes,
                likedBy: [...i.likedBy, userId],
              }
            : i
        );
        setProduct(updateProductList);
      })
      .catch((error) => {
        console.log("like error:", error.response || error.message);
      });
  };

  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "uvhmgcrb");
    data.append("cloud_name", "dofxfblck");
    axios
      .post("https://api.cloudinary.com/v1_1/dofxfblck/image/upload", data)
      .then((resp) => {
        setUrl(resp.data.url);
      })

      .catch((err) => console.log(err));
  };

  const createNewProduct = () => {
    axios
      .post(
        "http://localhost:5000/product/newProduct",
        {
          title: newTitle,
          description: newDescription,
          price: newPrice,
          publisher: userId,
          image: url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        getAllProduct();
        setShowFrom(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!showFrom) {
    return (
      <div>
        <p className="createdMassage">
          The product has been created successfully
        </p>
        <button className="backBTN" onClick={() => setShowFrom(true)}>
          Back
        </button>
      </div>
    );
  }

  const addToCart = (productId) => {
    axios
      .post(`http://localhost:5000/users/cart/${productId}`, { userId })
      .then((res) => {
        setCartItems(res.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
    return cartItems;
  };

  return (
    <div className="dashboardBar">
      <>
        <button
          className="createProductBTN"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? "Hide Create item" : "Create New Item"}
        </button>
        {showCreate && (
          <div className="createProduct">
            <h2>Create New Product</h2>

            <input
              className="titleInput"
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <textarea
              className="textareaInput"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDesciption(e.target.value)}
            ></textarea>

            <input
              className="priceInput"
              type="text"
              placeholder="Price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <input
              className="imageBar"
              type="file"
              name="image"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />

            <button
              className="createProductBTN"
              onClick={() => {
                uploadImage();
                createNewProduct();
              }}
            >
              Create Product
            </button>
          </div>
        )}
        {products&&
          products?.map((product) => (
            <div key={product._id} className="product">
              {updateProduct === product._id ? (
                <div className="updateInput">
                  <p className="updateParagraph">Update Product :</p>
                  <input
                    className="inputUpdate"
                    type="text"
                    value={newTitle}
                    placeholder="New Title"
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <textarea
                    className="textAreaUpdate"
                    type="text"
                    value={newDescription}
                    placeholder="New Desciption"
                    onChange={(e) => setNewDesciption(e.target.value)}
                  ></textarea>

                  <input
                    className="InputNewPriceUpdate"
                    type="text"
                    value={newPrice}
                    placeholder="New Price"
                    onChange={(e) => setNewPrice(e.target.value)}
                  />

                  <div className="updateButton">
                    <button
                      className="saveBTN"
                      onClick={() => handleUpdataBTN(product._id)}
                    >
                      <AiTwotoneSave size={40} />
                      <br />
                      Save
                    </button>

                    <button
                      onClick={() => setUpdateProduct(null)}
                      className="cancelBTN"
                    >
                      <AiOutlineClose size={40} />
                      <br />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="puplisher">
                    <p className="publisher">
                      <BiSolidUser /> {product?.publisher?.userName}
                    </p>
                  </div>
                  <h3>{product.title}</h3>

                  <div className="descrptionAndImage">
                    <p className="descroptionText">{product.description}</p>
                    <img className="imageProduct" src={product.image} />
                  </div>

                  <p className="priceText">Price: {product.price} $</p>

                  <hr />
                  <div className="likeAndCommentBar">
                    <p className="likeBar">
                      {product.likes} <AiTwotoneLike size={35} />
                    </p>
                    <p className="commentBar">
                      {product.comments.length} <AiOutlineComment size={35} />
                    </p>
                  </div>

                  <div className="likeAndCommentInputBar">
                    <button
                      className="likeButton"
                      onClick={() => handleLikeBTN(product._id)}
                    >
                      <AiFillLike size={30} />
                    </button>

                    <div className="commentInput">
                      <input
                        className="commentTextarea"
                        type="text"
                        placeholder=" Add a comment..."
                        onChange={(e) => setNewComment(e.target.value)}
                      ></input>

                      <button
                        className="commentButton"
                        onClick={() => createNewComment(product._id)}
                      >
                        <AiOutlineSend size={25} />
                      </button>
                    </div>
                  </div>
                  {product.comments && product.comments.length > 0 && (
                    <div className="comments">
                      <h4>Comments</h4>
                      {product?.comments.map((comment, index) => (
                        <div key={index}>
                          <ul>
                            <div className="commentLI">
                              <h5 className="commenter">
                                <CiUser size={30} />{" "}
                                {comment?.commenter?.userName}
                              </h5>
                              <p className="comment">{comment.comment}</p>
                            </div>
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  <hr />
                  <div className="deleteAndUpdateButton">
                    {product.userId === token.userId && (
                      <>
                        <button
                          onClick={() => {
                            setUpdateProduct(product._id);
                            setNewTitle(product.title);
                            setNewDesciption(product.description);
                          }}
                          className="updateBTN"
                        >
                          <AiFillEdit size={22} />
                          <br />
                          Update
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteBTN(product._id);
                          }}
                          className="deleteBTN"
                        >
                          <AiFillDelete size={22} />
                          <br />
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            addToCart(product._id);
                          }}
                          className="addToCartBTN"
                        >
                          <AiFillFolderAdd size={22} />
                          <br />
                          Add To Cart
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </>
    </div>
  );
};

export default Product;
