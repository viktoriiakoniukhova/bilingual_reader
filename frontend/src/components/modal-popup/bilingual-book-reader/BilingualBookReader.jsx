import React, { useEffect, useRef, useState } from "react";
import "./BilingualBookReader.scss";
import { useSearchParams } from "react-router-dom";
import SVG from "../../../svg-env";
import { useCookies } from "react-cookie";
import { ProgressBar } from "../../interactive-components/book-tiles/book-tile-card/BookTileCard";
import BookService from "../../../service/BookService";

const dummy_book = {
  id: 10,
  title: "The Seven Husbands of Evelyn Hugo: A Novel",
  progress: 22,
  numberOfPages: 320,
  author: "Taylor Jenkins Reid",
  image: "https://m.media-amazon.com/images/I/71KcUgYanhL._SY385_.jpg",
};

const dummy_pages = [
  {
    book: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
    translate: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
  },
  {
    book: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
    translate: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
  },
  {
    book: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
    translate: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
  },
  {
    book: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
    translate: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
  },
  {
    book: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
    translate: [
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
      "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus,purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifendvitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at,vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncusdui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis,sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit.Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputateullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magnarutrum hendrerit.",
    ],
  },
];

const BilingualBookReader = ({ className, onClose = () => {} }) => {
  const [searchParams] = useSearchParams();
  const book_id = searchParams.get("book_id");
  const translate_id = searchParams.get("translate_id");
  const [book, setBook] = useState(dummy_book);
  const [pages, setPages] = useState(dummy_pages);

  const bookService = BookService();

  useEffect(() => {
    //TODO: handle errors/loading
    bookService.handleGetById(book_id, setBook);
  }, [book_id]);

  const [cookies, setCookie] = useCookies();
  const [colortTheme, setColorTheme] = useState(
    cookies["color-theme"] || { key: "default", title: "Звичайна тема" }
  );
  const [viewDetails, setViewDetails] = useState(true);
  const [upperViewDetails, setUpperViewDetails] = useState(true);
  const [bottomViewDetails, setBottomViewDetails] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [textFieldCurrentPage, setTextFieldCurrentPage] = useState(1);
  const scrollWrapperRef = useRef(null);

  const getExpireDays = (days = 30) => {
    return { expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000) };
  };

  const changeColorTheme = (theme) => {
    setColorTheme(theme);
    setCookie("color-theme", theme, getExpireDays(30));
  };

  const toogleDetails = () => {
    setViewDetails(!viewDetails);
    setBottomViewDetails(!bottomViewDetails);
    setUpperViewDetails(!upperViewDetails);
  };

  useEffect(() => {
    const modal = document.getElementById("modal-dialog-wrapper");
    modal.setAttribute("color-theme", colortTheme.key);
  }, [colortTheme]);

  const handlechangePage = (value) => {
    setTextFieldCurrentPage(value);
    if (typeof value === "number" && value <= pages.length && value > 0) {
      scrollToPage(value);
    }
  };

  const handlePrevPage = () => {
    const newPage = Number(Math.max(1, currentPage - 1));
    scrollToPage(newPage);
  };

  const handleNextPage = () => {
    const newPage = Number(Math.min(pages.length, currentPage + 1));
    scrollToPage(newPage);
  };

  const handleScrolling = () => {
    const scrollWrapper = scrollWrapperRef.current;
    const sections = Array.from(
      scrollWrapper.getElementsByClassName("section-page-wrapper")
    );

    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const distance = Math.abs(sectionTop);

      if (distance < closestDistance) {
        closestSection = index + 1;
        closestDistance = distance;
      }
    });

    setTextFieldCurrentPage(closestSection);
    setCurrentPage(closestSection);
  };

  const scrollToPage = (pageIndex) => {
    if (
      typeof pageIndex === "number" &&
      pageIndex <= pages.length &&
      pageIndex > 0
    ) {
      const page = document.getElementById(`page-${pageIndex}`);
      const top = page.offsetTop;
      const topOffset = scrollWrapperRef.current.getBoundingClientRect().top;
      scrollWrapperRef.current.scrollTo({
        top: top - topOffset / 2,
        behavior: "instant",
      });
    }
  };

  return (
    <div className={"bilingual-book-reader-wrapper " + className}>
      <header
        className={`title-wrapper ${
          !upperViewDetails && !viewDetails ? "--hidden" : ""
        }`}
        onMouseOver={() => setUpperViewDetails(true)}
        onMouseLeave={() => setUpperViewDetails(false)}
      >
        <h1 className="title title-24">{book.title}</h1>
        <div className="header-menu-wrapper">
          <button className="btn-box" onClick={handlePrevPage}>
            <svg viewBox="0 0 30 30">
              <path d={SVG.backBtn} />
            </svg>
          </button>

          <div className="page-wrapper-selector">
            <input
              className="box-selector p-graph p-graph-12 --input"
              value={textFieldCurrentPage}
              type="text"
              onChange={(e) => handlechangePage(Number(e.target.value))}
            />

            <p className="p-graph p-graph-12">/</p>
            <div className="box-selector">
              <p className="p-graph p-graph-12">{pages.length}</p>
            </div>
          </div>
          <button className="btn-box" onClick={handleNextPage}>
            <svg viewBox="0 0 30 30">
              <path d={SVG.nextBtn} />
            </svg>
          </button>
        </div>
      </header>
      <main
        className="book-reader-wrapper scroll-wrapper"
        onScroll={handleScrolling}
        ref={scrollWrapperRef}
      >
        {pages.map((page, index) => {
          return (
            <section
              className="section-page-wrapper"
              key={index}
              id={`page-${index + 1}`}
            >
              <div className="box-reader-wrapper">
                <div className="book-page-wrapper">
                  {page.book.map((paragraph, indexJ) => {
                    return <p key={indexJ}>{paragraph}</p>;
                  })}
                </div>
              </div>
              <div className="box-reader-wrapper">
                <div className="book-page-wrapper">
                  {page.translate.map((paragraph, indexJ) => {
                    return <p key={indexJ}>{paragraph}</p>;
                  })}
                </div>
              </div>
              <div className="footer-page-wrapper">
                <p className="p-graph-16">{index + 1}</p>
              </div>
            </section>
          );
        })}
      </main>
      <footer
        className="footer-wrapper"
        onMouseOver={() => setBottomViewDetails(true)}
        onMouseLeave={() => setBottomViewDetails(false)}
      >
        <div
          className={`left-menu ${
            !bottomViewDetails && !viewDetails ? "--hidden" : ""
          }`}
        >
          <button className="btn btn-details" onClick={toogleDetails}>
            <p className="p-graph-16">
              {viewDetails ? "Сховати деталі" : "Показати деталі"}
            </p>
          </button>
          <div className="color-theme-wrapper">
            <p className="p-graph-16">Змінити тему</p>
            <div className="color-theme-boxs">
              <div
                className={`color-theme-box ${
                  colortTheme.key === "dark" ? "--active" : ""
                }`}
                style={{ "--color-theme": "#000000" }}
                onClick={() =>
                  changeColorTheme({ key: "dark", title: "Темна тема" })
                }
              ></div>
              <div
                className={`color-theme-box ${
                  colortTheme.key === "white" ? "--active" : ""
                }`}
                style={{ "--color-theme": "#fff" }}
                onClick={() =>
                  changeColorTheme({ key: "white", title: "Світла тема" })
                }
              ></div>
              <div
                className={`color-theme-box ${
                  colortTheme.key === "default" ? "--active" : ""
                }`}
                style={{ "--color-theme": "var(--pr-color-not-active)" }}
                onClick={() =>
                  changeColorTheme({ key: "default", title: "Звичайна тема" })
                }
              ></div>
            </div>
          </div>
          <div className="progress-bar-box-wrapper">
            <ProgressBar
              numberOfPages={pages.length}
              progress={(currentPage / pages.length) * 100}
            />
          </div>
        </div>
        <p className="p-graph p-graph-20 box-tag page-index">
          <b>&nbsp;{currentPage}</b>
        </p>
      </footer>
    </div>
  );
};

export default BilingualBookReader;
