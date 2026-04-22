const normalize = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const generateSlug = async (Model, title, currentId = null) => {
  const base = normalize(title);
  let slug = base;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (currentId) query._id = { $ne: currentId };

    const exists = await Model.exists(query);
    if (!exists) break;

    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
};

module.exports = generateSlug;
