const db = require('../db');

exports.createItemGet = (req, res) => {
  res.render('pages/createItem', {
    title: 'Add Item', // This title will be passed to the HTML
  });
};

// Handles form submission and adds an item to the database (POST request)
exports.createItemPost = async (req, res) => {
  const {
    id,
    user_id,
    title,
    description,
    category,
    price,
    is_available,
    image_urls,
    listed_at,
    location,
    is_service,
  } = req.body;

  try {
    // Save the item to the database
    await db.addItem({
      id,
      user_id,
      title,
      description,
      category,
      price,
      is_available: is_available === 'on', // Checkbox values are 'on' when checked
      image_urls: image_urls.split(',').map((url) => url.trim()), // Split comma-separated URLs into an array
      listed_at,
      location,
      is_service: is_service === 'on',
    });

    res.redirect('/users');
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).send('Error adding item to the database');
  }
};
