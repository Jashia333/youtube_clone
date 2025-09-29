import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegStatic!);  // tell fluent-ffmpeg where ffmpeg is

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.post('/process-video', (req, res) => {
  const { inputPath, outputPath } = req.body;
  if (!inputPath || !outputPath) {
    return res.status(400).send('Input and output paths are required.');
  }

  ffmpeg(inputPath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', () => res.status(200).send('Video processing completed successfully.'))
    .on('error', (err) => {
      console.error('Error processing video:', err);
      res.status(500).send('Error processing video.');
    })
    .save(outputPath);
});

app.listen(port, () => {
  console.log(`Video Processing Service listening at http://localhost:${port}`);
});
