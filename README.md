# Code Beautifier
A code will let your code on website prettier

## Method to use
Just add the following link below in your javascript file
```javascript
import { beautify } from 'https://cdn.jsdelivr.net/gh/revival0728/code-beautifier@master/beautify.js'
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
import { beautify } from 'https://cdn.jsdelivr.net/gh/revival0728/code-beautifier@master/beautify.js'

var code = `your source code`

beautify(code, 'your_id', 'your_language');
```

## Support Language
- c++
- python3
- javascript