# glycopeptide-advanced-search

> Advanced glycopeptide search on dataset generated created by user by
> specifying list of peptides (or masses) with list of glycan compositions
> (or masses)

## Usage

1. Import polyfill:

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
    ```

2. Import custom element:

    ```html
    <link rel="import" href="bower_components/glycopeptide-advanced-search/glycopeptide-advanced-search.html">
    ```

3. Start using it!

    ```html
    <glycopeptide-advanced-search></glycopeptide-advanced-search>
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`controller`  | *object*    | -            | datasource client initialized on creation of new dataset
`masses`      | *string*    | ``           | query list of masses
`ppm`         | *number*    | 10           | default ppm tolerance

## Methods

Method        | Parameters   | Returns     | Description
---           | ---          | ---         | ---
`search()`    | None.        | Nothing.    | Filters masses from the query, submits the search list to glycopeptide-multi-result,
              |              |             | and executes the query for each mass individually using search controller.
`ready()`     | None.        | Nothing.    | Sets the elements

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

1. Install [bower](http://bower.io/) & [polyserve](https://npmjs.com/polyserve):

    ```sh
    $ npm install -g bower polyserve
    ```

2. Install local dependencies:

    ```sh
    $ bower install
    ```

3. Start development server and open `http://localhost:8080/components/glycopeptide-advanced-search/`.

    ```sh
    $ polyserve
    ```

## History

For detailed changelog, check [Releases](https://bitbucket.org/pig-sib/glycopeptide-advanced-search/releases).

## License

[MIT License](http://opensource.org/licenses/MIT)
