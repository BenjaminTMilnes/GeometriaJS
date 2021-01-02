
filePaths = ["version_text.txt", "maths.js", "matrices.js", "general-functions.js", "graphics.js", "collisions.js", "application.js"]
files = []

for filePath in filePaths:
    with open(filePath, "r") as fileObject:
        files.append(fileObject.read())

outputFileText = "\n\n".join(files)

with open("compiled/geometria.js", "w") as fileObject:
    fileObject.write(outputFileText)