# Code Beautifier
A code will let your code on website prettier

## Method to use
Just add the code below in your javascript file
```javascript
import { beautify } from 'https://cdn.jsdelivr.net/gh/revival0728/code-beautifier@latest/beautify.js'
```
Below is the example code

In `HTML file`
```html
<!DOCTYPE html>	
<html>
	<head>
	</head>
	<body>
		<pre id="source"></pre>
		<script type="module" src="./script.js"></script>
	</body>
</html>
```
In `script.js`
```javascript
import { beautify } from 'https://cdn.jsdelivr.net/gh/revival0728/code-beautifier@latest/beautify.js'

var code = `print('hello, world')`

beautify(code, 'source', 'python3');
```

## Support Language
- c++
- python3
- javascript
- css

## Export functions
- `beautify(code, target, lan)`: output the prettier code to element which "id" is `target`. return none.
- `get_lan_data()`: return all the support language. return list.

## Getting Error
Check if you type the language or id right.

If you cannot fix this report me an issue.
