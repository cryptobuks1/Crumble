const { countShields, findShields } = require("../../dao/shield");
const moment = require("moment");

module.exports = async (req, res) => {
    const { minSize, maxSize, name, originalName, minDate, maxDate, extension, type, tags, visibility } = req.fields;
    const { path, description, sortField, sortOrder, garbage, limit } = req.fields;

    let query = { garbage: !!garbage || false };

    if (name) query = {...query, name: {$regex: `.*${name}.*`, $options: 'i'}};
    if (originalName) query = {...query, originalName: {$regex: `.*${originalName}.*`, $options: 'i'}};
    if (extension) query = {...query, extension: {$regex: `.*${extension}.*`, $options: 'i'}};
    if (type) query = {...query, type: {$regex: `.*${type}.*`, $options: 'i'}};
    if (description) query = {...query, description: {$regex: `.*${description}.*`, $options: 'i'}};

    if (tags) query = {...query, tags: {$in: tags}};

    if (path) query = {...query, path};
    if (visibility) query = {...query, visibility};

    if (minSize) query = {...query, size: { $gte: parseInt(minSize) }};
    if (maxSize) query = {...query, size: { $lte: parseInt(maxSize) }};
    if (minSize && maxSize)  query = {...query, size: { $lte: parseInt(maxSize), $gte: parseInt(minSize) }};

    if (minDate) query = {...query, uploadDate: { $gte: moment(minDate).toDate() }};
    if (maxDate) query = {...query, uploadDate: { $lte: moment(maxDate).toDate() }};
    if (minDate && maxDate)  query = {...query, uploadDate: { $lte: moment(maxDate).toDate(), $gte: moment(minDate).toDate() }};

    let sort = { _id: -1 };
    if (sortField) {
        sort = {};
        sort[sortField] = parseInt(sortOrder);
    }

    let shields, count;

    try {
        const result = await countShields(query);
        count = result[0].count;
    } catch (e) {
        return res.status(500).json({ status: "error", message: "database count error" });
    }

    try {
        shields = await findShields(query, sort, limit || 500);
        return res.status(200).json({ count, shields });
    } catch (e) {
        return res.status(500).json({ status: "error", message: "database read error" });
    }
};
