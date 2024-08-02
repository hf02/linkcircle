const name = /\/site\/(.*)\.html/.exec(location.href)[1];

document.body.innerHTML = `
			<h1>The web site of ${name}</h1>
			<a href="..">back</a>
			<p>with implicit:
				<a href="../?${name}-previous">Previous</a>
				<a href="../?${name}-blah">Random</a>
				<a href="../?${name}-next">Next</a>
			</p>
			<p>with explicit:
				<a href="../?lc=${name}-previous">Previous</a>
				<a href="../?lc=${name}-blah">Random</a>
				<a href="../?lc=${name}-next">Next</a>
			</p>
			`;
