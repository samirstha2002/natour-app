class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // advanced filtering

    let filters = {};
    for (const key in queryObj) {
      if (key.includes('[')) {
        const [field, operator] = key.split('[');
        const cleanOp = operator.replace(']', '');
        if (!filters[field]) filters[field] = {};
        filters[field]['$' + cleanOp] = Number(queryObj[key]);
      } else {
        filters[key] = queryObj[key];
      }
    }
    this.query = this.query.find(filters);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort;

      // if it's an array (from repeated params), join with space
      if (Array.isArray(sortBy)) {
        sortBy = sortBy.join(' ');
      }
      // if it's a string with commas, convert to space-separated
      else if (typeof sortBy === 'string') {
        sortBy = sortBy.split(',').join(' ');
      }

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('_id'); // default
    }

    return this;
  }

  limitFields() {
    //field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
