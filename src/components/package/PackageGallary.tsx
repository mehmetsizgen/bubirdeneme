'use client'
import { useState } from "react";

import PhotoAlbum from "react-photo-album";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";


const PackageGallary = (
  {photos} :
  {
    photos: any[],
  }
  ) => {

  const [index, setIndex] = useState(-1);

  return (
    <>
      <PhotoAlbum
        photos={photos}
        layout="masonry"
        columns={3}
        targetRowHeight={150}
        onClick={({ index }) => setIndex(index)} />

      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  )
}

export default PackageGallary