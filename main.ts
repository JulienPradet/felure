import { canvasJp, CanvasJpDrawable, CanvasJpStrokeStyle } from "canvas-jp";
import { prodMode } from "canvas-jp/plugins/prodMode";
import { fxhashCollection } from "canvas-jp/plugins/fxhashCollection";
import { inOutBounce, inOutCirc } from "canvas-jp/ease";
import {
  CanvasJpColorHsv,
  CanvasJpGradient,
  Color,
  Gradient,
  hsvToRgb,
  RadialGradient,
  rgbToHsv,
} from "canvas-jp/Color";
import { CanvasJpPoint, Point } from "canvas-jp/Point";
import {
  isInPolygon,
  Polygon,
  polygonArea,
  PolygonFromRect,
} from "canvas-jp/Polygon";
import { CanvasJpShape, Shape, SmoothShape } from "canvas-jp/Shape";
import { getInBetween } from "canvas-jp/position";
import { mapRange, clamp } from "canvas-sketch-util/math";
import { rotate, translate, translateVector } from "canvas-jp/transform";
import { angle } from "canvas-jp/angle";
import { distance } from "canvas-jp/distance";
import { edgesFromPoints } from "canvas-jp/edges";
import { getIntersection } from "canvas-jp/intersection";
import { UpdateImageData } from "canvas-jp/UpdateImageData";
import { CanvasJpArc, Circle } from "canvas-jp/Circle";
import { CanvasJpFill } from "canvas-jp/draw";

const hashes = [
  {
    generationHash: "ooLdnFyTY7ee64KhuCmXWGx5x9XDtuS2eEjD8G6uat3KdGLqokt",
    id: 1174021,
  },
  {
    generationHash: "onx2sEoQefVcnB2ZZwy5LJY7FC1x7hk7CebF3pb9PubvY5jHzi2",
    id: 1174020,
  },
  {
    generationHash: "oo6fdgcnRzXV24Xa9XDEfMsZDKJqJTAe6eXWyrKrkzXRA7s5m9E",
    id: 1174010,
  },
  {
    generationHash: "ooHG7nSk5vapc2HCp35xF4aD6mMHet7iYHZJVLjyasMmRPxQ9x5",
    id: 1174007,
  },
  {
    generationHash: "ooQpWvqKqeYhAdAVwjrXT2M8b1uJf9wvEyrxGeepChQSjKRydqz",
    id: 1174004,
  },
  {
    generationHash: "onhVjs5ZECUGnZixdQ5P6bxL7Axij4rhGAGQyXEY8s2mHzrTRBm",
    id: 1174003,
  },
  {
    generationHash: "onmU4mvnANcEEnnCUdXKtYGNReKczy67qgvWcbrjhVQgCW6RCKj",
    id: 1174002,
  },
  {
    generationHash: "ooDuLRE8orrrDu1bHSxKPYHm9DeiiE7nhZAqbUtD68ufQwFYfaX",
    id: 1174000,
  },
  {
    generationHash: "onrVzUq3FRdcQsHjGTVkeAv26MqFqttkrpTqK6SsiXnN7mAZung",
    id: 1173999,
  },
  {
    generationHash: "onijq1K9hfj4UfJQdVFJKs3idETqWqj6iYkCgMFzi9BoBGLDZd1",
    id: 1173997,
  },
  {
    generationHash: "ooTE3JtcCnZ4vNSA7akURVUNt8aQqc4mRYkrk5osLaBweoT7yjG",
    id: 1173996,
  },
  {
    generationHash: "oo88Jx5d6of32xE6AjHKNYowWnYjC9iFqU6nEHmX45niyHFB2hQ",
    id: 1173995,
  },
  {
    generationHash: "opLqqsxM9PEh4W7pxWXa1fswt7Cg8PUXkM7iwbawzPEQCvaasys",
    id: 1173992,
  },
  {
    generationHash: "ooyAjaj92xyt3Utvq84xFbWZjc3fqb1PA2bvDaANHajJG7rbh4q",
    id: 1173991,
  },
  {
    generationHash: "oonzvrf8E2QMFJN4BzHS7Hrjmn75186jkG5fQKtbWVsknYicmgF",
    id: 1173990,
  },
  {
    generationHash: "onssFR33Fwp68PPFndpWaybXdYcmvio3DhWwXJVQ7L97rq6oYiq",
    id: 1173989,
  },
  {
    generationHash: "ooHtyXXWcE1gerM2wrHJGY6kXksrP1ZhsX42cnK8REKFBoBJUej",
    id: 1173988,
  },
  {
    generationHash: "opRgTWnYFgGAYKXP9ko6bm7XiFwJ5YWb1JYCgDGGozpgRPchhqk",
    id: 1173987,
  },
  {
    generationHash: "ooqZ3sSsSwPqxAfnXet5AwoweXTdthnikLQ6Z5p1Ha8ai9Cf4vw",
    id: 1173986,
  },
  {
    generationHash: "opNekSekXD3pPybEXkVsMGANFnckdRhPma2cWwp9Nx5NzuChaU6",
    id: 1173985,
  },
  {
    generationHash: "ooam27w5teGv96CLnQmXuqKtxHYWSW9rQLj6fYKe7gaSK2YNPCE",
    id: 1173984,
  },
  {
    generationHash: "oo1xwu5zvJJXkjLiPw2gAXVXbtrMGcyb9u9kWG9c3ku82x7gR3g",
    id: 1173983,
  },
  {
    generationHash: "ooq2mw6cHFpfGRBHsEqb5FrGzQdtLRoL5cs46HQ6LNBKrGNcoWF",
    id: 1173982,
  },
  {
    generationHash: "opWdi8e7crxuD7bYtuyudxxVdVeMD54n4VoDWnyDbX2Z7ExaN2Z",
    id: 1173981,
  },
  {
    generationHash: "ooxiecc1HJGtN7mDW4rrM5FhdKAuSbKoegbkAEgFDgVXxuo7ge5",
    id: 1173980,
  },
  {
    generationHash: "oogfk7kufaDLLQDkmeQXktRqLyM7UbtWzWY87emUQnAHB4NprU4",
    id: 1173979,
  },
  {
    generationHash: "opQhCC7FWMKuoT9FRLHhGivhrzb6aTKaczqkAXj3s9YEVH15JEh",
    id: 1173978,
  },
  {
    generationHash: "ooxQuRsJnPE65cBgSLFAREfJvfmqutkhUmyy4TFsK4ggjrsVS2q",
    id: 1173977,
  },
  {
    generationHash: "op6c2EHFj4pKA9VSDj2uBkY1m138TmF36AZmrJbKtAVhziZSeWV",
    id: 1173976,
  },
  {
    generationHash: "ooGfZPokEjAyBCbyG4DUyAuhXwKxCnA9cCGybCVSveKxFM13mLs",
    id: 1173975,
  },
  {
    generationHash: "opVffrosTH1CzCEnKM4rLFaQbAk2bXuJ7s6PNgVkT6KcMYeJEGa",
    id: 1173974,
  },
  {
    generationHash: "opL78idzDDhA1sBqB3R6iZ41K9w7vqpenRbERHF3a9orCdiW2Jx",
    id: 1173973,
  },
  {
    generationHash: "op4dDmY1zx8B9RSLxcJUWrN949QQSRUX5x4ABfCRySCMFLvZ2bQ",
    id: 1173972,
  },
  {
    generationHash: "opRK9aWgU4tKzPCstKMb9VnahB3Uh7gcgvczdcAoYya73E3eDzq",
    id: 1173971,
  },
  {
    generationHash: "oo6Kac9k4FHSVwfyBM94KETwMJwgaobb76ASeRBbT2jcJp1hykg",
    id: 1173970,
  },
  {
    generationHash: "ooS6ZTdENrD7FJJ7VHPnTKbi6irw4dzNJuT5KZmwxfpSA4PELv8",
    id: 1173969,
  },
  {
    generationHash: "ooZcPKsJaQgUUqUj9qAmByhYUDE8XbHYsCLpyLfYAiAPRMG1gWd",
    id: 1173968,
  },
  {
    generationHash: "ooTv5sji5nMUswqu2PHkTfwGeiuudwsm3NXLAaH88scBUaih3KT",
    id: 1173967,
  },
  {
    generationHash: "ooTWvBn9uDHoSDARxHmcnVXbZiCF2q5iEnmeNrrhhXGZgnNGXDX",
    id: 1173966,
  },
  {
    generationHash: "ooF6Mfz4ioyusFQ3bdmQAGpNkYDHNx1DxfxaQ2wn1h4xU8zuGdH",
    id: 1173965,
  },
  {
    generationHash: "oneRqeoAgSJMYFYg9koQjsQAxLTysxRnzoyQPqQ46mz4C9L6sit",
    id: 1173964,
  },
  {
    generationHash: "onxbnDyEFr5xSbqTcDUEdDQvDhBnfGS3FHtwBq6P8Z8iWEWG7Hk",
    id: 1173963,
  },
  {
    generationHash: "onpZFMvsZMPCoU5rquvJ8K5J8yFANqrhu41KLaRNmZeSAjG8igc",
    id: 1173962,
  },
  {
    generationHash: "oodtzxTS4MA9mETSNirBkibV9rr5Mo71xwuirxHa4A1KMe52Z1d",
    id: 1173961,
  },
  {
    generationHash: "onoZ6422YZwDCMtSswSynoahTaUEVZcvn3aFdC34VKgAVxood1v",
    id: 1173960,
  },
  {
    generationHash: "ooxaw8YfkSbX8u3bh39MbaV2KpQSFvQURXrv8Mv8JKcWvwKT1Ky",
    id: 1173959,
  },
  {
    generationHash: "onxk8wLtCMqWPagUDiW53ZjaM7wnDteFENfZd4u1L15i7NKcHBx",
    id: 1173958,
  },
  {
    generationHash: "opHJfQpa93m1xEyutjj8zLxyNuMK3tQ4oCmMAWqrUxSWmqCWSLs",
    id: 1173957,
  },
  {
    generationHash: "ooyx8MLszb2w8ZDsgS8tTqaweKzgWwhgEskVCAZgEvkuMvtaytX",
    id: 1173956,
  },
  {
    generationHash: "opMLGjXk2jeJbFAaBZMVnmCjah3hZSUCd6WSDs9dq3D522uv89V",
    id: 1173955,
  },
  {
    generationHash: "opDo2gak6RbsdZN1AukgVAv4nHymfW44DRv1MCQUvEq9gS5yDrz",
    id: 1173954,
  },
  {
    generationHash: "ooSVwes7Pde3xFAvU5RUAMQRi8vqw3LaDT8gu6uK2UVLw5rPnw5",
    id: 1173953,
  },
  {
    generationHash: "ooFESH3yTyTft91yuSA7FdexobW8AXqG3cPZm4gWGs8j5wCLR3B",
    id: 1173952,
  },
  {
    generationHash: "oo5x1Fn4gJc4qcKtSy6gQ57yf5ftLMbVbbFfir4XCBpf9UmgQzW",
    id: 1173951,
  },
  {
    generationHash: "op2TkifrFUx1SyhXX6qchPKRUZfuFD85L2V11AL3Tp25iT49pe8",
    id: 1173950,
  },
  {
    generationHash: "oonDXPCWLpZxSkbrKSwA3Zok53vVCy7JKy171kLBzPMmhENWDQe",
    id: 1173949,
  },
  {
    generationHash: "opMRpYss7dRZUWwzSQe25JeHFwZySEB187y7cZW46mv7bMW8P5j",
    id: 1173948,
  },
  {
    generationHash: "opALvLXFyVFKfVYducR5QPHwSED2jNdyN7qPExwMvxUyyVK1UGQ",
    id: 1173947,
  },
  {
    generationHash: "op8h7E1L7abkzQLwH9V4qCvK1qZW5uRqZsBMSDhKDbPPKmPm3Qs",
    id: 1173946,
  },
  {
    generationHash: "opJBSs7Y1rK5q3Truwhmzkz72MdRBpKqmCAenAxLMte8RddThYz",
    id: 1173945,
  },
  {
    generationHash: "ooALtThCmYCGe83Nmy9oE39LkmyknojktCnJnxLNSR3Q3Xr1x3s",
    id: 1173944,
  },
  {
    generationHash: "ooDYuEWoFjzJzzCiU962Yzb5YrjTV7Gz7cAfsmB8PFfBhciSFBh",
    id: 1173943,
  },
  {
    generationHash: "ony51qeND5EmPLekcVppwgR2AkyDgEEL4kw8jaJ7AJHXqmQ4eBA",
    id: 1173942,
  },
  {
    generationHash: "ooFoDBCiR4bTx1as6WRHurgxHTUeBotbG2iiFaX4wXYrNr72EPi",
    id: 1173941,
  },
  {
    generationHash: "onj8zggny9hx5hAyfMz2z2WU44MAK9xYPYGsVH1KzM53rdGFi84",
    id: 1173940,
  },
  {
    generationHash: "oorxvCFyKzJEVFMJY62ggUGYTDW8LTRMeJkG1gNWdGoRsGk1twH",
    id: 1173939,
  },
  {
    generationHash: "ooWAeHy9nSuPryX57iEWyP9dBGKwXe8nr3JSSNPFgvNViS22wAb",
    id: 1173938,
  },
  {
    generationHash: "opa1nt8jMFz1zxPiXLNPVrimxTzNyZNErd66TKifatTtvtaSpQb",
    id: 1173937,
  },
  {
    generationHash: "ooiN7pemngdt9EVnAHY8PcWnXPSAszA3iruh4qqqVCjyUjXe7V7",
    id: 1173936,
  },
  {
    generationHash: "opYswzkc7uqE3govhYQJV3A79Y9ujJ4NgpGJdc9UX9Qv2FRTXA2",
    id: 1173935,
  },
  {
    generationHash: "ooRT78EGQpGpWHQBERaYBaBmnTdYHxWUezx8j4nkwqnaQCSSi9s",
    id: 1173934,
  },
  {
    generationHash: "onv51VeBaapNtxCGG95DfvMTnJ5FkzSWw5Yhs5AUGyGPAg827Rq",
    id: 1173933,
  },
  {
    generationHash: "ooDjRoSVbspuR4kpSVxJfRFzH15L5wyctJ1jDdP66anTyGntycJ",
    id: 1173932,
  },
  {
    generationHash: "op9h3zzqUP6GmYUY1XoSFNFqkJMMzcq3FfRztoTVUnbzdtNGZwe",
    id: 1173931,
  },
  {
    generationHash: "ooic7EXVkC2NDAzghse1R1TL1o5Azh4ssr4EXpKiHK6gRZ5Wtdk",
    id: 1173930,
  },
  {
    generationHash: "opKZWYcfiyfLWyxoz3NvtQQTFjM9cSFWzqrvZk5qAmphE1Drhww",
    id: 1173929,
  },
  {
    generationHash: "opTkTnxZkg5nBZ4ieZwVU7ACN1wRw2UE8huMmVGZYFvG1mBdz8B",
    id: 1173928,
  },
  {
    generationHash: "ongcFVqUb5w6CuijApTMw76nwfKifMPCcfDmKdcWmGtAoT7Fn13",
    id: 1173927,
  },
  {
    generationHash: "op92Rdf47JEFdNXPmwWapQ71fpL2pk3s8AcPFrThWJ1bpBB73wb",
    id: 1173926,
  },
  {
    generationHash: "oovvV2GDWczuPVPTBT7gtB692RNPSXdkpoyWMiV9yi4BYmAkg4i",
    id: 1173925,
  },
  {
    generationHash: "ooResqMPEqDr6UvubRXzw9ho3uuRKMPdf2zjpZ7jpTMDuBMzEoZ",
    id: 1173924,
  },
  {
    generationHash: "opAj9WZHmcKgZ2knmxPiPKiNnUfdxkcoK6RtGDgy9jyHRwm99Gb",
    id: 1173923,
  },
  {
    generationHash: "op9GG1fimAtwfWCQ8KrsEHWuT33gvszCctgd9j2VfBix2pJHwZ9",
    id: 1173922,
  },
  {
    generationHash: "oo51o3v1dwk624LhCpGKQ5bKiPfr4oaR2KCyCMbE8PhNrrSLZrQ",
    id: 1173921,
  },
  {
    generationHash: "onpfvwuQe5msGgGMqedK1PQ2Pfv74tx7WH3KLNgoH6dC8EFc4Bk",
    id: 1173920,
  },
  {
    generationHash: "ooTqHF8p8FJNMdYZ6CAjRKtDxHJyNGCV7SND2gTWgist9hFiuex",
    id: 1173919,
  },
  {
    generationHash: "opNyUabC3W5b8pMGbASjHQ5vWEkJwQCcjunaezP2ibLZb81Tio6",
    id: 1173918,
  },
  {
    generationHash: "opVE4HEJ4o5cgCzoSCGYcebdUt3Sz8yLZ6xdSuZ1Wek9nUnAe5q",
    id: 1173917,
  },
  {
    generationHash: "ookLqFr1eefmvzSxcMN4mC6NYRxGbGt7oWFCScxvaM2UNcQ3puM",
    id: 1173916,
  },
  {
    generationHash: "ooDmZBGEmat2z7uUsZkXvre9rDA21sRhiuMCVxh3rJsQTkzZNnE",
    id: 1173915,
  },
  {
    generationHash: "ooWazpvzA6M6YseK6ndq8YS8m3LbPqVWPrbs8P5ZjNFnJ6giJUa",
    id: 1173914,
  },
  {
    generationHash: "oob12L6S85YPAxD7jQV7SzMKmc1G7nT3ELUu6rQ84QEeeQ7dDC8",
    id: 1173913,
  },
  {
    generationHash: "ooXYL7y4dxQQrqt7KHpFPi5JEGFsupFryfi12e4aZyEypz3Lhd4",
    id: 1173912,
  },
  {
    generationHash: "oopfpsLMGVo36cUWXQi2sKevnp5aXvQQAqSoQx6c1bKdGiymZs4",
    id: 1173911,
  },
  {
    generationHash: "ooHjWgYCf4VXPoiTAfYobXzPGSaK8gGTVXVav3P2sCxBucGzUkg",
    id: 1173910,
  },
  {
    generationHash: "ooiFu7AX4HAqGbnMzRLPoWGbYZs6qfk44J23QUfSjeqZbof2QuQ",
    id: 1173909,
  },
  {
    generationHash: "oonqaN9p4wLr1hP7BoDU5hojyshneWocbLAbBuejSqqjUgdQDHP",
    id: 1173908,
  },
  {
    generationHash: "ooRy7DHpGfiJaNFVumZSjNc9dz3eZYSsJCtdYtpWp6Ngrk7KTu3",
    id: 1173907,
  },
  {
    generationHash: "opMHr9MoCc5b4ozvs4tJ9Y1Fb5XDdnQL7kR3vPVW4YpViNbcXYT",
    id: 1173906,
  },
  {
    generationHash: "oonN7KeoXJJD8VMdV6EYrKbP5S5vzZVpyWjGF5F4YFbnUuMbA2b",
    id: 1173905,
  },
  {
    generationHash: "op1ukCTBvmKPERm7cgnN4kYq981SqQq2RBQjyBZ2c3eziE9mZzt",
    id: 1173904,
  },
  {
    generationHash: "opUreaFZzrjNLk31ZjuKE12hMDJXkGXPeVcDM4dVsDkzoFJmwXP",
    id: 1173903,
  },
  {
    generationHash: "opZnBiSwnMpqACREtafNpppN2qBHY8XF6UR326ybSxE2oYo5pB4",
    id: 1173902,
  },
  {
    generationHash: "ooHi5ahW3u7XH9CY9FCPqrWm16xiUiXgdxQkVbCqNfpX44HsgNz",
    id: 1173901,
  },
  {
    generationHash: "onx7mAqHUdz9CLWYAZtNUPt9zMmMmaSGKrcq72jnYYK9Q3Nv8ub",
    id: 1173900,
  },
  {
    generationHash: "opUTZacKNnRJmtZd5a9LM62MxDQNLCSjoQbdq7qqxjskXPnRHPj",
    id: 1173899,
  },
  {
    generationHash: "ooFmxmUXaZd9LLPJorkNGDP3CM38RNVVyjo2nbCJ7ZncAyrJ857",
    id: 1173898,
  },
  {
    generationHash: "opLAFTaDBwZZQJbkhRDcujMM8c5t9qs8NKwSiy9mSqpfpHMSFm3",
    id: 1173897,
  },
  {
    generationHash: "opH6LeZRT3kTipRdQQA9RCRJExdDTyk3GJBrvwS7tnHkCKY9hus",
    id: 1173896,
  },
  {
    generationHash: "opX1uDemMqTgviCECmQuaRpFBMaQ3fGFKwKboUdgUVbJbjuw6Mq",
    id: 1173895,
  },
  {
    generationHash: "ooCXPMQkw1tBTgMwgVgd5V3jniF1dZxFPyoYyRSZb3CY9AwseZm",
    id: 1173894,
  },
  {
    generationHash: "opCvp4udE5ZzRuoVQerwUmT7hu4voCK5t2RjWf3D31FLX2dP4ce",
    id: 1173893,
  },
  {
    generationHash: "opPJa8J891fWgeqbJBk8z8kAhnexsnpoDhZZKC6ccLGzRw7DxSH",
    id: 1173892,
  },
  {
    generationHash: "ooEK1RL3RzKeA4VQgmrn295quH2EUVqmtjN9cgvyQo63VW9GjG6",
    id: 1173891,
  },
  {
    generationHash: "ony3CgG7Uo6pKPmLp47oXoLq2UdF2V5AJUannfeZpxMx1tb156x",
    id: 1173890,
  },
  {
    generationHash: "onsvd42uGM1UhAUmLSwRrrLrEAwptq5jzmCfN2FvcmfitfaFQaS",
    id: 1173889,
  },
  {
    generationHash: "onfmqyhRohM8onJcRxmqqiPA8QDrUxDg9TnjzEjoFCbksp3aa2V",
    id: 1173888,
  },
  {
    generationHash: "oofhXZzKNUnmfm3k8ayZeDe6sua2LeZC1Bu2Pmgv6hzZgPZj5dJ",
    id: 1173887,
  },
  {
    generationHash: "op6Wtp1iN8TDKciFVLbLNouUGirAUYuBCKPwHkxzNHMmgwkSMUe",
    id: 1173886,
  },
  {
    generationHash: "ooqzvJU4Aj8iaDr3hLYY1jNvDawogziTsT3RWoum7uida3Gb6DV",
    id: 1173885,
  },
  {
    generationHash: "ooKCd1g3XNc8ogf8S6XTRJKQc7DsZC3LdoLH2cVtF86tBjKKAWe",
    id: 1173884,
  },
  {
    generationHash: "ooSMJmDMKxYG3s9bCUkMcfoY3dkbM38GphvkG1mc2zrkuTgGBhP",
    id: 1173883,
  },
  {
    generationHash: "oo4wKBFRbbJstWFdj1tojDt5us3gd9RVK7TWXZzYrcuqX5a75Y3",
    id: 1173882,
  },
  {
    generationHash: "onjmbXyL1UDswcFnS9w5v8yzQ85UwvTSWNxkHZ4uQAFUvb87h2Q",
    id: 1173881,
  },
  {
    generationHash: "opENE5GcLrvJzvk1gGhZH4cZydt4jqEj6G6QQiH3kevdkZYcSrW",
    id: 1173880,
  },
  {
    generationHash: "ooKbJndi7KufqUXggJbK3tvZiwZyW4j69BoDYJ13AZqVQ6T8UU9",
    id: 1173879,
  },
  {
    generationHash: "oo6vQgaaLHWvNb9J3PSAbR2okaykt66PFEpFQkPCMhd76J5RY4y",
    id: 1173878,
  },
  {
    generationHash: "ootfqvonfLFr2CsWshgJRLTXCzzWMN6p1bH7mLFFbdfg9iaQzSt",
    id: 1173877,
  },
  {
    generationHash: "ooXpgVUyLwEqsdqwH77Qvxf3tZJUBE8aECYUNSpYjEuWpdSgDSp",
    id: 1173876,
  },
  {
    generationHash: "ooXTnSK5XtmrUri7T1izFCMVHBxF9QrtHcy4E3mS4t7CAFpLSFT",
    id: 1173875,
  },
  {
    generationHash: "ooxESwxYMFAJT6JjLxmgsGddFRpQgmy7fqkrAUn2RhD27dgvQcp",
    id: 1173874,
  },
  {
    generationHash: "ongkp7gvEDjBFgeWHnahb9odeAXsFsC4T7gFbxKT3U7g2w1TGji",
    id: 1173873,
  },
  {
    generationHash: "ooXSwc3ePv3TPBoo3MGGcZxRbAv5znPxmHszrwbq1efRufTehJK",
    id: 1173872,
  },
  {
    generationHash: "onwmtobdAgiEha3Kys6wT5XxNkaa17nrqs2gwHVeymJxK2CPaNA",
    id: 1173871,
  },
  {
    generationHash: "ooVdjG5p5L9pE4hWL5kSpSPcqaAFPEihe6JpDztqXZZez3ms8sc",
    id: 1173870,
  },
  {
    generationHash: "ooJUow2NzA6t8EkQGpcgnaV9dfwFcfVGaQfSfCvPnxAWJPAcMcs",
    id: 1173869,
  },
  {
    generationHash: "ooC8nuFcVmm2SjzJ48BBL4YbseC8uRGbLXybAqu8dJAaoxTzzbu",
    id: 1173868,
  },
  {
    generationHash: "oo3a3kawaCcNBKugPQWN5aXL3322omS1QULqC9DF8Pd41YArkXc",
    id: 1173867,
  },
  {
    generationHash: "oojLbaMnTntrHinYRDG921ZUpMdzfYESsR9pYiNuUKo9D1JbAuc",
    id: 1173866,
  },
  {
    generationHash: "ooiYxAUQ31t8XuHkGYKvaHG4va8QS9GAnvEukhuVtEBb6C5XCWA",
    id: 1173865,
  },
  {
    generationHash: "ooBtEvn4Zt2zqeze1MgdWzYVRbEordiQvzsAZo3ngR9xi4fhWdK",
    id: 1173864,
  },
  {
    generationHash: "ooMW8WA2XTc152WAZcLGowPe8Kkgt8RmHqegueojPmHqMqDNDb6",
    id: 1173863,
  },
  {
    generationHash: "opUSAPyLkxMjcEK8hJn5tmoyaGuxQF71pBpwg5y1fNdLbNudqxq",
    id: 1173862,
  },
  {
    generationHash: "oni6GgcvuK89VLFJVLCGX5VruXmpTeXDrSozisCCoSoNYTExmzU",
    id: 1173861,
  },
  {
    generationHash: "oo9KLyZ6tyZb8WFUHtEQcsQwwxcesYjBeEvMLqJF3CcChW26i2b",
    id: 1173860,
  },
  {
    generationHash: "ooLKmQz3xKbpU1YJr2y61VQQ5oqEptn9Fa7eVKUP6HYwy4rkQse",
    id: 1173859,
  },
  {
    generationHash: "op9LB4AC7SqTmvCbQPb9RH17KsMRtpurVH8YX7AQ4tgFTgyw1Vq",
    id: 1173858,
  },
  {
    generationHash: "ootzLmxeQ9teBrEdwx8bJwn6fRXPCvg3UsH2uHhMmFwmxNPbKMZ",
    id: 1173857,
  },
  {
    generationHash: "ooX2zff2wiVX8yzm13TBoH7MGUKm8dW1YvvR152PtwUayW6LUBd",
    id: 1173856,
  },
  {
    generationHash: "onqazbLv8LZ4wj1dYb9ekfBVaJ4Fizu5MY7xu7t5E4diF8tqGAn",
    id: 1173855,
  },
  {
    generationHash: "ooVY9LHWg7onjZH1Vws6XUs67dzc9g4KqqFeSpteogC4So7Mu6v",
    id: 1173854,
  },
  {
    generationHash: "ooDQrQvGPrwERYYf3j8NCgfzYihyajYSNGusH4euWiknNM5ViYe",
    id: 1173853,
  },
  {
    generationHash: "op8Gw8pqcGPequTmAwvBdPL6xR1NFHe8NokFFp3si9keAztBZRK",
    id: 1173852,
  },
  {
    generationHash: "oouaB1aKFQfwnkeog1zeSEXFMKwmTxf7LGasZV9cUwKcChJiLcX",
    id: 1173851,
  },
  {
    generationHash: "opRQcp2eSDRkSobjVoS2kk4KfqdzCiVaHRMYAS61VTya9rmEYoA",
    id: 1173850,
  },
  {
    generationHash: "oonBWySs17uJEfuuzVbyGPAnibDTsCRwYxb8mUYnoafpxvUafJ6",
    id: 1173849,
  },
  {
    generationHash: "oopEi6JKAGRv24XvqNsT2YCjRBxXJVz7Lm4BrmaD6ghqd78Rr8H",
    id: 1173848,
  },
  {
    generationHash: "oo5KqM78DYAcw1TiGhBiZjYDFprWbFejQ3TbXoqkdk3hNzh3xYt",
    id: 1173847,
  },
  {
    generationHash: "oob82M7u1YamcJEFxWkVaKNE3QR8wVYvuNmo1E5hq5xEUftf7Hm",
    id: 1173846,
  },
  {
    generationHash: "onsH3KBHBwe6WttSbyhXPiDmPEDYjVYpjbxkKoVYCstvHv327zH",
    id: 1173845,
  },
  {
    generationHash: "oo3ynRTMQtTwxL7vXLk2EW542oW6mY3kdesPRBgmHMhsnxwXdrC",
    id: 1173844,
  },
  {
    generationHash: "ooUtJyUNfkzzcDY2kZ8cKfEuDm965JQDoqnRpS77yRdGJave59o",
    id: 1173843,
  },
  {
    generationHash: "ooiLXqvow65MwpBCg8xzuE5gpQ5kZGwPpaUEsJZSWsSiUnucGxz",
    id: 1173842,
  },
  {
    generationHash: "onf7huv8V9F57sJ9XH19CAKDzpKMtq91az9TfBiwKG4RYbtXKdY",
    id: 1173841,
  },
  {
    generationHash: "opWZpoSEfxKK8rYKs8yjyGsjnjuMqNXP3j83ZMkhvdVhaSxLntN",
    id: 1173840,
  },
  {
    generationHash: "onfKqJyQmw8eV9eUJf7vPUFujWs3rvs6dE4VUnv5fhXKyibAXhS",
    id: 1173839,
  },
  {
    generationHash: "onenNhjkw8k3u53QLuktZainTGzpkx2XHmXzgyJt9WjUananXxk",
    id: 1173838,
  },
  {
    generationHash: "opWuoWwMv3P2iuP2vxhsQHBN88HiPr79MnQgYTuSxgHygh8He4j",
    id: 1173837,
  },
  {
    generationHash: "oo9YdAF8h2oKSAK6vGusQBQp1ak6mjGFXDZy2nNuq948Mueaa3s",
    id: 1173836,
  },
  {
    generationHash: "ooihZCJYXoN5wgjgGSh8v8o6VPcri9wctnxKYqy5TMkfs2b4LHG",
    id: 1173835,
  },
  {
    generationHash: "ooGNuc5HicWV348S7Qh3T7HJmLZ6wpGzdnFPUC9QRTzngpxVCZB",
    id: 1173834,
  },
  {
    generationHash: "onvpjwcc4JC5yhTX5si4PvWudB5UFFiiU1rZXtCfxeFzvy3rwsZ",
    id: 1173833,
  },
  {
    generationHash: "onyGqWEGegpEX3ebLTLLfkdxjCv69FF2VqwdoUTb9raHco4uvCi",
    id: 1173831,
  },
  {
    generationHash: "oo22cDM1BhKMYsR2hkF8VgEJDC8UyAEMkhLonfWDJTe8stt2vQH",
    id: 1173830,
  },
  {
    generationHash: "oogDED5GvVU4zv7jLJ4cmN6dVsCENnJZiu2XPgFeuaXUr6NMQ3u",
    id: 1173829,
  },
  {
    generationHash: "oocxwJoM45px5JQ89cZeQmibban5fnUf6MMe8PVHEZmH6NDhowJ",
    id: 1173828,
  },
  {
    generationHash: "ooxXWiAtTKd5mPAJJYHbQSULRdjX4U5htmuqFnwCsiDB4ct62Wg",
    id: 1173827,
  },
  {
    generationHash: "oohxgxqQBDMAfyMMasdCAT6HG7bNpWai3d5dQbvcnukbyv7bTsf",
    id: 1173826,
  },
  {
    generationHash: "oneohcfy3975iZvBjUT1TXj1ssSGK6dsA8JbWKWHvEZrqNZvpYb",
    id: 1173825,
  },
  {
    generationHash: "oobJdtX79RWRiauvHyWjsDqCQDQgsRtxYCX7Q3ftYmqLuqGqCcK",
    id: 1173824,
  },
  {
    generationHash: "opNFEH2iR4pSTQ2nBBEDbh9BTq3FcjuFMSgR7wh3BFQkoPqwFzf",
    id: 1173823,
  },
  {
    generationHash: "onjtkgYJR4Msh7EvHfrVWHipDk1PEtLmhFK2sYNkuMP3ZxpPevU",
    id: 1173822,
  },
  {
    generationHash: "opQ4Mfjv2Sn5pjs47c1a181kuERHpvNDanw1wM31x7xbsnuf5DT",
    id: 1173821,
  },
  {
    generationHash: "oosgPtXSRapvcBHETfr7Rym28sF8jGrwxB6GyJQtvYi3SjLLQJF",
    id: 1173820,
  },
  {
    generationHash: "onrohDS46KeAVzkrscHqBsGZ38YQqqcz6MGZ18kyMQ4RApZ7R9n",
    id: 1173819,
  },
  {
    generationHash: "opEbYQ3H6ssuwtu84UebLJd9rkJmFTCUYLPrP7h87CSfwvxqyTM",
    id: 1173818,
  },
  {
    generationHash: "onkNENfU3BVafUSQpGGL88uyAnH8MyKbxoAKQPw2h4MaTQ5YoNJ",
    id: 1173817,
  },
  {
    generationHash: "oobewNziqL5EmvgYGZrPqcR9ZDw5Te2RCtp3DUkBE1WG1gbjLCv",
    id: 1173816,
  },
  {
    generationHash: "oowTEEi766f4BseDoW1d75v9wNP58EHPCnotXNpR7D49k5Cc4mX",
    id: 1173815,
  },
  {
    generationHash: "ooHrDwYQaWSL6AUdHvRv4uraekfYK6qVzzDTcumQCfcbCnUdr96",
    id: 1173814,
  },
  {
    generationHash: "ooMqPt37cHptT18A6hEwoEeTjF1dkxubmEK4yAMHnxpeK3EEAQP",
    id: 1173813,
  },
  {
    generationHash: "opWmTFTSmCpDLvhV96KEZtXf8L8XzqgrRpBhsFvhPSi98dLEGix",
    id: 1173812,
  },
  {
    generationHash: "ooB7HBhNJJgf6rJYKPp5oB3b2vFyhVw68QUvDbKhDP29wVsZm8A",
    id: 1173811,
  },
  {
    generationHash: "onezGpPq3hs5X9SoQerEny7owUCW4squCvJeU6TfotbNMwzY7M8",
    id: 1173810,
  },
  {
    generationHash: "onx8jFxZtSrRwBQB5rmxtMgwLZ6DH6yi2JfHSw6CFE9KsTjf7Ws",
    id: 1173809,
  },
  {
    generationHash: "ooJfwKMzrdRambynHkj8KLXy2LfRjD2r47h8uWG8ubK5QuCiRTV",
    id: 1173808,
  },
  {
    generationHash: "ooTLKTvtrdCeFAQ3StePGjkxg8xPyAqFZL8XBH9WcDDuP5ohiKh",
    id: 1173807,
  },
  {
    generationHash: "oo5gdzZ8t9hRbVZFgHVjNd41xe2Ak55mBn3UtRGo5Cb2dQQPqUk",
    id: 1173806,
  },
  {
    generationHash: "oojCsEKradxcoWP8cEGeji46dpZJKCCgLYJ5u6LcwqNwJnFRTLC",
    id: 1173805,
  },
  {
    generationHash: "onnkBfvZwttMkH7dmRwQiLQDpKnKaZTXzhkdHKBzFzttbmQ1n7X",
    id: 1173804,
  },
  {
    generationHash: "onmyPFVBdJLX4F5ezySQ3H2ha52oXUSTRJtWWULHJctrd9KJPpL",
    id: 1173803,
  },
  {
    generationHash: "oo1w5MpLgPUZYa5Z1MvYs6Y1EVFJizesoZ7DA14zPFw6tsNhGDn",
    id: 1173802,
  },
  {
    generationHash: "oopERqE1bRKXQEH313WRgTzXJYoZmGGoWwfCy4Nu14BMJ1QaSgv",
    id: 1173801,
  },
  {
    generationHash: "ooKwCbzXH75aQRqS1np7pyNCP3xZzvksLjUsZLhyG4WU9jRkcwA",
    id: 1173800,
  },
  {
    generationHash: "ooC666yLgwptajLf42oiFPTHRrXeKvz4vTsxAsDenp7M5NGxDTt",
    id: 1173799,
  },
  {
    generationHash: "op6EYSrvnyzF3dakNia9NbFHRtL14bhvw1Wm97ogfXeG32VtCid",
    id: 1173798,
  },
  {
    generationHash: "oo6xAYEA3UgtMUEMMKeYWVnEUtdtoJNRT3vu7AmbymdzVPwvo9V",
    id: 1173797,
  },
  {
    generationHash: "oonjjK6t6B8pJNFKhgHbRWafHzvSvAi2RcgfxL6cjozNfiY9M1F",
    id: 1173796,
  },
  {
    generationHash: "ooHggjqEMfNFFbWgrTCsy9UWcqakupWwCvb8HuVLyLy2Wkp32ZF",
    id: 1173795,
  },
  {
    generationHash: "opNDHkthfLLk9NHFtTtLYozUj1K1Fb3BMDbcCHwdHS8cmaiW7bT",
    id: 1173794,
  },
  {
    generationHash: "oopXDunuZ85pktZU741jC6C2BhSzC1JD6knxbUNA2hFdTrLSSBK",
    id: 1173793,
  },
  {
    generationHash: "opHRSA9pwy1uaPXHM9Q9WqzRfMphnkpRHFX2CDzQrk5Cu8JX9NQ",
    id: 1173792,
  },
  {
    generationHash: "oo6vLxxyyX9qhodNA3BRhN7BZsrCG8ogyDzbRqJTXqFB1GX9HbM",
    id: 1173791,
  },
  {
    generationHash: "ooVNDNf1HMSEFtCRf8ZpjAS5mcZ7AeiJLAdafTQ2eCQ1nQSVVBr",
    id: 1173790,
  },
  {
    generationHash: "oo5YeoA5cMoHYHVak6YbB68fKm2Ni2KsPnqjLsicTyYTEjidziF",
    id: 1173789,
  },
  {
    generationHash: "onmUxQr3ZLqjidEWw1Cwv7TCa45P33aF9xuVgcYQkx6q3YU4FHx",
    id: 1173788,
  },
  {
    generationHash: "onvMEgxi9gRj1noehoLjmCLiG9hxafcZkdNkVEZPv2oNLAYhBQq",
    id: 1173787,
  },
  {
    generationHash: "oo79G28QLd3F7guXg38GwdCh5UafP8ipZs3VRnWz1Z7UQU2y8cg",
    id: 1173786,
  },
  {
    generationHash: "ons7otC8x7JAZCVPgwjhn8ZByvrLw9dR1vteZcZ42wS2WczrsrQ",
    id: 1173785,
  },
  {
    generationHash: "ooMkagoA8P1oW5Q6TH2x9oWyQ8q8fMQ3Grt1UynUpMwL1BRX6o3",
    id: 1173784,
  },
  {
    generationHash: "op9wDHGwKa2TjupgQMT9m5eonA14c752KVFTGSxkNJfhttRSrNs",
    id: 1173783,
  },
  {
    generationHash: "oo2ekaxu73h4TnMQLSrTGek4iXGSiUxHVFdGn9wXinM46vK5Jia",
    id: 1173782,
  },
  {
    generationHash: "ooGsDNw5i5KzLKqc6aTCZCaBQkbiwof6EXkwk4x3gvKT9QmyA9r",
    id: 1173781,
  },
  {
    generationHash: "opPXkE2PJNhKW9a4QsL8g2cvYnu8MT2573RTi1qxPN1d1rMvLjW",
    id: 1173780,
  },
  {
    generationHash: "ooBZ7iqFiwLixae4PPuet9xgR18nL5FEKCLoNdQMATGyTcrTpki",
    id: 1173779,
  },
  {
    generationHash: "opSF1vyLn1rgFitapaHFrcBFiRrNpEajYPJjjViFxw8xY6h2zCe",
    id: 1173778,
  },
  {
    generationHash: "oomYVbLQjF1NznhdU4eKGgYub99UBtk9FGa5MEwhKwaUuMaut9N",
    id: 1173777,
  },
  {
    generationHash: "op2aR9LupqjPJptpLy367AMn7G8ZETA7tHq4p8WvTKximbjxc3d",
    id: 1173776,
  },
  {
    generationHash: "opFdAKfzcxTonwjKp8CAJyXxfoijEGabFxTz2f4cCa2fD8t3vNq",
    id: 1173775,
  },
  {
    generationHash: "ongKUL92Pix6dnq4CHDDj4oaBNjuG8QDgdAU1A2ia5ZdZv6WwJZ",
    id: 1173774,
  },
  {
    generationHash: "onyqXSDGma7swSRUEW4biNjAsTfyuJU7iCTwMn4Gt82yvVEACpE",
    id: 1173773,
  },
  {
    generationHash: "ooyvC9DnTNhkDpM6oRmM1f7koTxWPTrRLtnruHfwMqKsq4Yy4dd",
    id: 1173772,
  },
  {
    generationHash: "ooFY6pxf8xN91C6PikAqyzNZai4ezcRUv9MYXVRwhK2FG2cLWfW",
    id: 1173771,
  },
  {
    generationHash: "opWmApZX1QJEkT8TAmt1hQ83Pmo1NaJ29o4MwGjaqzraMnmY688",
    id: 1173770,
  },
  {
    generationHash: "oox6zV3BdPPzcdUSaoLSZH4QNg84hqkmFg3vvdbayL5PXJuUve1",
    id: 1173769,
  },
  {
    generationHash: "ooA5qmtWxyDBnW7jNE6Y8WuMSeK1CRfek184CbJ3KtSAJQ7fbVp",
    id: 1173768,
  },
  {
    generationHash: "opRRMwSuu7YJuvBPgzEsxm8zG2Rs1A3m3yznRmPGS8Apfckqcap",
    id: 1173767,
  },
  {
    generationHash: "opZNh88Urst9bzRNyTpJKo5NHCHMd1SVJtS64zaLygk7mi1KFyj",
    id: 1173766,
  },
  {
    generationHash: "ooHVeo47zRYjRmE8CYDL1TkTk92UCAQEjheZGu7VjhWQ3xEM2yk",
    id: 1173765,
  },
  {
    generationHash: "ooCN2RwcpzTJZyzZYoLhudRWmeYoszByauu15x3XbE68HLX5rSn",
    id: 1173764,
  },
  {
    generationHash: "ongk1vL6Lc3NM3QsLgBjvzQAM3tx685vm68FuNfqPPc78pUXh9D",
    id: 1173763,
  },
  {
    generationHash: "ooVx6StatxPmYL7YMnBfYNezKQeyw9fNr1gUZea12z63FiNkPmX",
    id: 1173762,
  },
  {
    generationHash: "oowmM9TFpKRtDX1Za4U7oKrNMFiQdoWi5Te3gEByjn9cMFMr8tk",
    id: 1173761,
  },
  {
    generationHash: "opKA1vziyLwgCucm2evcu1JEUEAYXva9prJoPDJGGRmVBWMsehT",
    id: 1173760,
  },
  {
    generationHash: "opSKaAUvYmydZznEQyyEMH8jgRK4g9gmebFahjnUPSGxAJctiEn",
    id: 1173759,
  },
  {
    generationHash: "ooaapZeZN21EUXMni6faqSqWnyZYSqGoz3toc7hDipfy78eEth2",
    id: 1173758,
  },
  {
    generationHash: "oofjLYbeSYDuG2mdf3TrmgTZdnsxGd8cD8THxGu4XzsZFJZCsKg",
    id: 1173757,
  },
  {
    generationHash: "oobWmLEtKHzS7ehGAXLF8nHoFpvk4uXs5xf45fULXsogV8xR4EL",
    id: 1173756,
  },
  {
    generationHash: "ooRa5rjJdk7Df5qPXJP12QwSBQqXfenghuep1uj1LueM8L8rMmH",
    id: 1173755,
  },
  {
    generationHash: "onqmLzEpGFoxYtFhgyZrGva8iU5SgX8RQpA2LdJx4yD22FoJo1P",
    id: 1173754,
  },
  {
    generationHash: "oow9tDXuRHXEiynnAskezojgxVMdrWn7HBVroXipVAcMikAkQwX",
    id: 1173753,
  },
  {
    generationHash: "onxdGPpKi2ML7qjnDjL2mzDjdWcsWzvcJ2yKXsy8buNoRfVEHrW",
    id: 1173752,
  },
  {
    generationHash: "oocGH4n7SMEcZV7ATSLfCjxU5NVjaV64U8wZuYbT1sc1o2FchjF",
    id: 1173751,
  },
  {
    generationHash: "onzodjvQWfQ2N6Prhz6tDMtx8vUzKVfE7NKZY6AXFEgXWyytyku",
    id: 1173750,
  },
  {
    generationHash: "ooWqqir8d3unVwLGES39MbbfSQ6xcdbZPAt2bWFGNnPN4cSiE9U",
    id: 1173749,
  },
  {
    generationHash: "op6gDbkwYQqnUC4d1iJCwknsgrYPKycRbFGjD9hcKQXxKPx8SWh",
    id: 1173748,
  },
].reverse();

canvasJp(
  document.querySelector("#container") as HTMLElement,
  function* (random, { width: windowWidth, height: windowHeight, resolution }) {
    const width = 1920;
    const height = 1920;

    const center = translateVector(
      mapRange(random.value(), 0, 1, 0.15, 0.25) * Math.min(width, height),
      random.value() * Math.PI * 2,
      Point(width / 2, height / 2)
    );
    const isIrregularGrid = random.value() > 0.17;
    const isGiganticSize = isIrregularGrid && random.value() > 0.992;

    const isDullLight = !isGiganticSize && random.value() > 0.88;
    const isColorful = random.value() > 0.92;
    let isDarkBackground =
      (!isColorful && !isDullLight) || random.value() > 0.2;

    const isLightPicker = random.value() > 0.38;
    if (isLightPicker) {
      isDarkBackground = false;
    }

    const isColoredBackground = isLightPicker && random.value() > 0.74;

    const baseHue =
      isColorful || isColoredBackground || random.value() > 0.7
        ? 0
        : isLightPicker
        ? random.gaussian(0, 0.05)
        : random.gaussian(0, 0.1);

    const firstPaletteColors = {
      darkBlue: Color(baseHue + 214 / 360, 0.56 * 1.05, 0.5 * 0.9),
      greyBlue: Color(baseHue + 178 / 360, 0.15 * 1.05, 0.65 * 0.9),
      red: Color(baseHue + 5 / 360, 0.65, 0.72),
      yellow: Color(baseHue + 41 / 360, 0.64 * 0.95, 1 * 0.9),
      beige: Color(baseHue + 37 / 360, 0.17 * 1.05, 0.99 * 0.85), // this one must be last for psychedelic
    };

    const dimLight = isLightPicker && !isColoredBackground ? 1 : 0.98;
    const dimSaturation = 0.9;

    const secondPaletteColors = {
      purple: isLightPicker
        ? Color(baseHue + 265 / 360, dimSaturation * 0.48, 0.45 * dimLight)
        : Color(baseHue + 265 / 360, dimSaturation * 0.53, 0.52 * dimLight),
      green: Color(baseHue + 78 / 360, dimSaturation * 0.73, 0.78 * dimLight),
      dark: Color(
        baseHue + 180 / 360,
        dimSaturation * (isColoredBackground ? 0.14 : 0.34),
        0.25 * (isColoredBackground ? 0.8 : isLightPicker ? 1.8 : 1) * dimLight
      ),
      orange: Color(baseHue + 18 / 360, dimSaturation * 0.82, 0.95 * dimLight),
      white: Color(baseHue + 40 / 360, dimSaturation * 0.57, 0.99 * dimLight),
    };
    const thirdPaletteColors = {
      pink: Color(baseHue + 0.96, dimSaturation * 0.53, 0.78 * dimLight),
      cyan: Color(baseHue + 0.435, dimSaturation * 0.4, 0.85 * dimLight),
      blue: Color(baseHue + 0.68, dimSaturation * 0.25, 0.42 * dimLight),
      white: Color(baseHue + 0.24, dimSaturation * 0.2, 0.97 * dimLight),
    };

    const paletteColors = random.pick(
      new Array<{
        name: String;
        palette: { [key in string]: CanvasJpColorHsv };
      }>().concat([
        { name: "1", palette: firstPaletteColors },
        { name: "2", palette: secondPaletteColors },
        { name: "3", palette: thirdPaletteColors },
      ])
    );

    const palette = Object.values(paletteColors.palette);

    let pickedBackground = random.pick(palette);

    let mainHue = random.value();

    const white = Color(mainHue, 0.08, 0.99);
    const black = Color(mainHue, random.value() > 0.5 ? 0.4 : 0.1, 0.18);
    let blackAndWhitePalette = [white, black];

    const gradientAngle = random.value() * Math.PI * 2;
    const hasGradient = isColorful || random.value() > 0.05;
    const gradientStrength = Math.pow(random.value(), 0.27);
    const hasCellGradientHomogeneity = random.value() > 0.2;

    const threshold = isDarkBackground ? 0.4 : 0.2;

    const smoothFactor = 0.01 * (isGiganticSize ? 1.3 : 1);

    const invertProgress = random.value() > 0.95;

    Color.mix.fxname = "Counter Clockwise";

    function oppositeMix(
      colorA: CanvasJpColorHsv,
      colorB: CanvasJpColorHsv,
      factor: number
    ): CanvasJpColorHsv {
      let hueA = colorA.h;
      let hueB = colorB.h;
      if (hueA - hueB > threshold) {
        hueB += 1;
      } else if (hueB - hueA > threshold) {
        hueA += 1;
      }
      return Color(
        (hueA * factor + hueB * (1 - factor)) % 1,
        colorA.s * factor + colorB.s * (1 - factor),
        colorA.v * factor + colorB.v * (1 - factor)
      );
    }
    oppositeMix.fxname = "Clockwise";

    function randomMix(
      colorA: CanvasJpColorHsv,
      colorB: CanvasJpColorHsv,
      factor: number
    ): CanvasJpColorHsv {
      return random.pick([Color.mix, oppositeMix])(colorA, colorB, factor);
    }
    randomMix.fxname = "Glitch";

    type ColorMixer = (
      colorA: CanvasJpColorHsv,
      colorB: CanvasJpColorHsv,
      factor: number
    ) => CanvasJpColorHsv;

    const rgbMix = (
      colorA: CanvasJpColorHsv,
      colorB: CanvasJpColorHsv,
      factor: number
    ) => {
      const rgbA = hsvToRgb(colorA.h, colorA.s, colorA.v);
      const rgbB = hsvToRgb(colorB.h, colorB.s, colorB.v);

      const normalMix = Color.mix(colorA, colorB, factor);

      const rgbResult = Color(
        ...rgbToHsv(
          rgbA[0] * factor + rgbB[0] * (1 - factor),
          rgbA[1] * factor + rgbB[1] * (1 - factor),
          rgbA[2] * factor + rgbB[2] * (1 - factor)
        )
      );

      return Color(
        rgbResult.h,
        rgbResult.s * 0.4 + normalMix.s * 0.6,
        rgbResult.v
      );
    };

    const colorMixer: ColorMixer = random.pick(
      new Array<ColorMixer>()
        .concat(new Array(10).fill(oppositeMix))
        .concat(new Array(10).fill(Color.mix))
        .concat(new Array(isLightPicker ? 1 : 10).fill(randomMix))
    );

    function blackAndWhite(): ReturnType<ColorPicker> {
      const mainColor = isDarkBackground || !isLightPicker ? black : white;
      const secondColor = random.pick(
        blackAndWhitePalette.filter((color) => color !== mainColor)
      );
      return {
        name: "Black & White",
        getBackgroundColor: () => mainColor,
        getMainColor: () => mainColor,
        getSecondColor: (mainColor: CanvasJpColorHsv) => secondColor,
      };
    }

    function multicolor(): ReturnType<ColorPicker> {
      const mainColor = isColorful
        ? firstPaletteColors.beige
        : random.pick(palette);
      return {
        name: "Multicolor",
        getBackgroundColor: () => mainColor,
        getMainColor: () => mainColor,
        getSecondColor: (mainColor: CanvasJpColorHsv) =>
          random.pick(palette.filter((color) => color !== mainColor)),
      };
    }

    const darkBackground = Color(270 / 360, 0.53, 0.1);

    function multicolorDarkBackground(): ReturnType<ColorPicker> {
      const mainColor = darkBackground;
      return {
        name: "Multicolor",
        getBackgroundColor: () => mainColor,
        getMainColor: () => mainColor,
        getSecondColor: (mainColor: CanvasJpColorHsv) =>
          random.pick(palette.filter((color) => color !== mainColor)),
      };
    }

    function psychedelic(): ReturnType<ColorPicker> {
      return {
        name: "Multicolor",
        getBackgroundColor: () => palette[palette.length - 1],
        getMainColor: () => random.pick(palette),
        getSecondColor: (mainColor: CanvasJpColorHsv) =>
          random.pick(palette.filter((color) => color !== mainColor)),
      };
    }

    function psychedelicDark(): ReturnType<ColorPicker> {
      return {
        name: "Multicolor",
        getBackgroundColor: () => darkBackground,
        getMainColor: () => random.pick(palette),
        getSecondColor: (mainColor: CanvasJpColorHsv) =>
          random.pick(palette.filter((color) => color !== mainColor)),
      };
    }

    const duochromeBackground = isLightPicker
      ? isColoredBackground
        ? pickedBackground
        : random.pick(palette)
      : darkBackground;

    const duochromeColorOptions = palette.filter(
      (color) =>
        Math.abs(color.v - duochromeBackground.v) > 0.4 &&
        Math.abs(color.s - duochromeBackground.s) > 0.2
    );

    function duochrome(): ReturnType<ColorPicker> {
      const firstColor = random.pick(duochromeColorOptions);
      const secondColor = random.pick(
        duochromeColorOptions
          .filter((color) => color !== firstColor)
          .concat(
            hasGradient &&
              (!hasCellGradientHomogeneity || gradientStrength > 0.2)
              ? []
              : [blackAndWhitePalette[0]]
          )
      );
      const colors = [firstColor, firstColor, firstColor, secondColor];

      return {
        name: "Duochrome",
        getBackgroundColor: () => duochromeBackground,
        getMainColor: () => random.pick(colors),
        getSecondColor: (mainColor: CanvasJpColorHsv) => random.pick(colors),
      };
    }

    type ColorPicker = () => {
      name: string;
      getBackgroundColor: () => CanvasJpColorHsv;
      getMainColor: () => CanvasJpColorHsv;
      getSecondColor: (
        mainColor: CanvasJpColorHsv,
        progress: number
      ) => CanvasJpColorHsv;
    };

    const makeColorPickerFactory: () => ColorPicker = () =>
      colorMixer === randomMix
        ? psychedelic
        : random.pick(
            new Array<ColorPicker>()
              .concat(
                new Array(
                  isColoredBackground || isColorful || isLightPicker ? 0 : 6
                ).fill(blackAndWhite)
              )
              .concat(new Array(isColorful ? 0 : 16).fill(multicolor))
              .concat(new Array(4).fill(multicolorDarkBackground))
              .concat(new Array(isColorful ? 0 : 16).fill(psychedelic))
              .concat(new Array(4).fill(psychedelicDark))
          );

    const colorPickerFactory = makeColorPickerFactory();

    const coreColorPicker = colorPickerFactory();

    function testPicker(): ReturnType<ColorPicker> {
      const darkSaturation =
        !isColorful && isDarkBackground
          ? mapRange(
              Math.pow(random.value(), 3),
              0,
              1,
              0.1,
              colorMixer === rgbMix ? 0.3 : 0.5
            )
          : 0.5;
      const darkValue = mapRange(darkSaturation, 0.1, 0.5, 0.1, 0.06);

      const mainColor = coreColorPicker.getMainColor();

      const backgroundColor =
        colorPickerFactory === blackAndWhite
          ? coreColorPicker.getBackgroundColor()
          : isColorful
          ? coreColorPicker.getBackgroundColor()
          : isDarkBackground
          ? Color(mainHue, darkSaturation, darkValue)
          : Color(mainHue, 0.1, 0.98);

      let dullColor = isColorful
        ? mainColor
        : isDarkBackground
        ? Color(
            mainHue,
            colorPickerFactory === blackAndWhite
              ? backgroundColor.s
              : isDullLight
              ? Math.max(0.0, coreColorPicker.getBackgroundColor().s * 0.2)
              : 0.13,
            isDullLight
              ? Math.max(0.08, coreColorPicker.getBackgroundColor().v * 0.2)
              : Math.max(
                  backgroundColor.v + random.gaussian(0.05, 0.02),
                  backgroundColor.v
                )
          )
        : Color(mainHue, 0.05, 0.96);

      return {
        name: "test",
        getBackgroundColor: () => backgroundColor,
        getMainColor: () => dullColor,
        getSecondColor(mainColor, progress) {
          const easedProgress = clamp(random.gaussian(progress, 0.01), 0, 1);

          if (isColorful && isDullLight) {
            const color = coreColorPicker.getSecondColor(
              mainColor,
              easedProgress
            );
            return colorMixer(backgroundColor, color, Math.pow(progress, 1));
          }

          let secondColor = isDarkBackground
            ? Color(
                (random.gaussian(coreColorPicker.getMainColor().h, 0.1) + 1) %
                  1,
                dullColor.s,
                dullColor.v
              )
            : Color(
                random.gaussian(
                  coreColorPicker.getMainColor().h * 0.5 + mainHue * 0.5,
                  0.1
                ),
                dullColor.s,
                dullColor.v
              );
          let mixFactor = Math.pow(easedProgress, 0.9);
          let saturationFactor = 0.6;
          let valueFactor = 0.8;
          let saturationDim = 0;

          if (isNaN(mixFactor)) {
            console.log("here?");
          }

          if (
            isDullLight ||
            (easedProgress < random.gaussian(0.2, 0.05) &&
              random.value() > 0.15) ||
            random.value() > 0.99
          ) {
            secondColor = coreColorPicker.getSecondColor(
              coreColorPicker.getMainColor(),
              progress
            );
            mixFactor = clamp(2 * mixFactor, 0, 1);
            saturationFactor = isDullLight
              ? mapRange(easedProgress, 0, 1, 0.2, 0.6)
              : 0.8;
            saturationDim = 0.2;
          } else if (
            (easedProgress < random.gaussian(0.4, 0.05) &&
              random.value() > 0.3) ||
            random.value() > 0.95
          ) {
            secondColor = coreColorPicker.getSecondColor(
              coreColorPicker.getMainColor(),
              clamp(mapRange(easedProgress, 0.2, 0.4, 0, 1), 0, 1)
            );
            mixFactor = mapRange(
              clamp(
                Math.pow(
                  clamp(mapRange(easedProgress, 0.2, 0.4, 0, 1), 0, 1),
                  0.1
                ),
                0,
                1
              ),
              0,
              1,
              0.4,
              1
            );
            saturationFactor = mapRange(mixFactor, 0.4, 1, 0.5, 0);
            valueFactor = mapRange(mixFactor, 0.4, 1, 0.6, 0.8);
          }

          const mixed = colorMixer(
            mainColor,
            Color(
              secondColor.h + random.gaussian(0, 0.05),
              secondColor.s,
              secondColor.v
            ),
            mixFactor
          );

          const saturation =
            colorPickerFactory === blackAndWhite
              ? 0.05
              : clamp(
                  (mixed.s * (1 - saturationFactor) +
                    secondColor.s * saturationFactor) *
                    (1 - saturationDim),
                  0,
                  1
                );
          const value = clamp(
            (secondColor.v * (1 - valueFactor) + mixed.v * valueFactor) * 1.05,
            0,
            1
          );

          return Color(clamp(mixed.h, 0, 1), saturation, value);
        },
      };
    }

    const lightPicker: ColorPicker = () => {
      const background = isColoredBackground
        ? pickedBackground
        : colorPickerFactory === blackAndWhite
        ? coreColorPicker.getBackgroundColor()
        : colorPickerFactory === multicolorDarkBackground ||
          colorPickerFactory === psychedelicDark
        ? coreColorPicker.getBackgroundColor()
        : Color(33 / 360, 0.21, 0.99);
      return {
        getBackgroundColor: () => background,
        getMainColor: () => coreColorPicker.getMainColor(),
        getSecondColor: (mainColor, progress) => {
          const easedProgress = clamp(random.gaussian(progress, 0.01), 0, 1);

          const color = coreColorPicker.getSecondColor(mainColor, progress);

          const dullLight = colorMixer(
            background,
            coreColorPicker.getMainColor(),
            0.9
          );

          if (
            easedProgress < random.gaussian(0.2, 0.05) &&
            random.value() > 0.2
          ) {
            return colorMixer(color, background, 1 - progress);
          } else {
            return rgbMix(
              dullLight,
              colorMixer(
                dullLight,
                color,
                clamp(random.gaussian(Math.pow(1 - progress, 0.3), 0.1), 0, 1)
              ),
              progress
            );
          }
        },
        name: "lightPicker",
      };
    };

    const colorPicker = isLightPicker ? lightPicker() : testPicker();

    const amountOfCells =
      !isIrregularGrid || isGiganticSize
        ? 2
        : mapRange(Math.pow(random.value(), 10), 0, 1, 1.2, 4);
    const row = Math.round(
      Math.max(
        4,
        Math.ceil(mapRange(random.value(), 0, 1, height / 500, height / 200))
      ) *
        (2 * amountOfCells)
    );
    const column = Math.round(
      Math.max(
        4,
        Math.ceil(mapRange(random.value(), 0, 1, width / 500, width / 200))
      ) *
        (2 * amountOfCells)
    );

    const minGridMargin = 0;
    const maxGridMargin = Math.min(width / column, height / row) * 0.1;
    let gridMargin = mapRange(
      Math.pow(random.value(), 5),
      0,
      1,
      minGridMargin,
      maxGridMargin
    );
    const cellHeight = (height - (row - 1) * gridMargin) / row;
    const cellWidth = (width - (column - 1) * gridMargin) / column;

    const bigCellsRatio =
      !isIrregularGrid || isGiganticSize ? 6 : 6 * amountOfCells;
    const maxColumns = isIrregularGrid
      ? isGiganticSize
        ? Math.floor(Math.min(column, row) * 0.65)
        : Math.max(2, Math.floor(Math.max(column, row * 0.7) / bigCellsRatio))
      : 1;
    const maxRows = isIrregularGrid
      ? isGiganticSize
        ? Math.floor(Math.min(column, row) * 0.65)
        : Math.max(2, Math.floor(Math.max(column * 0.7, row) / bigCellsRatio))
      : 1;

    const splitDistance =
      random.value() > 0.02
        ? (Math.min(cellHeight, cellWidth) /
            mapRange(
              Math.pow(random.value(), 0.3),
              0,
              1,
              isIrregularGrid ? 160 : 160,
              200
            )) *
          (isDullLight ? 0.7 : 1)
        : 0;

    const offsetFactor = mapRange(random.value(), 0, 1, 10, 20);

    const progressPrecision = mapRange(random.value(), 0, 1, 0.0003, 0.001);

    let perlinMin = 1;
    let perlinMax = 0;
    for (let x = 0.2; x < 0.8; x += 0.05) {
      for (let y = 0.3; y < 0.7; y += 0.05) {
        let noiseValue = random.noise2D(
          x,
          y,
          progressPrecision * Math.min(width, height)
        );
        perlinMin = Math.min(perlinMin, noiseValue);
        perlinMax = Math.max(perlinMax, noiseValue);
      }
    }

    const perlinProgress = (x: number, y: number): number => {
      return Math.pow(
        clamp(
          mapRange(
            random.noise2D(
              x / Math.min(width, height),
              y / Math.min(width, height),
              progressPrecision * Math.min(width, height)
            ),
            perlinMin * mapRange(random.value(), 0, 1, 0.8, 1),
            perlinMax * mapRange(random.value(), 0, 1, 1, 1.2),
            0,
            1
          ),
          0,
          1
        ),
        0.5
      );
    };
    perlinProgress.fxname = "Flow";

    const randomProgress = (x: number, y: number): number => {
      return mapRange(random.value(), 0, 1, 0, 0.1);
    };
    randomProgress.fxname = "Random";

    const radius =
      Math.min(width, height) * mapRange(random.value(), 0, 1, 0.12, 0.3);

    const circleProgress = (x: number, y: number): number => {
      try {
        const radiusForProgress =
          radius *
          mapRange(
            Math.abs(
              random.noise1D((angle(center, Point(x, y)) / (Math.PI * 2)) * 2)
            ),
            0,
            1,
            1,
            1.1
          );
        const secondCut = radiusForProgress * 2.3;

        const d = distance(center, Point(x, y));
        const progress = clamp(
          d < random.gaussian(radiusForProgress, 0.05)
            ? Math.pow(
                clamp(mapRange(d, 0, radiusForProgress, 1, 0), 0, 1),
                0.3
              )
            : d < random.gaussian(secondCut, 0.05)
            ? Math.pow(
                clamp(mapRange(d, radiusForProgress, secondCut, 0, 0.8), 0, 1),
                0.4
              )
            : mapRange(d, secondCut, radiusForProgress * 4, 0.5, 1),
          0,
          1
        );

        const circleValue = Math.pow(clamp(progress, 0, 1), 1.1);

        if (isNaN(progress)) {
          console.log("circle", d, radiusForProgress, secondCut);
        }

        return clamp(circleValue, 0, 1);
      } catch (e) {
        console.log(x, y);
        throw e;
      }
    };
    circleProgress.fxname = "Resonance";

    const rosaceProgress = () => {
      const radius = (1400 / 4) * random.gaussian(1, 0.1);
      const numberOfCircles = Math.round(mapRange(random.value(), 0, 1, 2, 6));
      const phase = random.value() * Math.PI * 2;
      const cutAboveRadius = mapRange(random.value(), 0, 1, 1, 8);

      const circles = new Array(numberOfCircles).fill(null).map((_, index) => {
        const progress = index / numberOfCircles;
        const angle = progress * Math.PI * 2 + phase;

        return {
          radius: radius * 1.4,
          center: translateVector(radius, angle, center),
        };
      });

      const progress = (x: number, y: number): number => {
        const distanceFromRosace = Math.min(
          ...circles.map(({ center, radius }) => {
            radius = radius * 1.1;
            const d = distance(center, Point(x, y));

            return d < radius
              ? Math.pow(1 - d / radius, 0.4)
              : Math.pow((d - radius) / radius, 0.4);
          })
        );

        const factor = Math.pow(1 - distanceFromRosace, 2);
        const rosaceProgress =
          Math.pow(distanceFromRosace, 1.5) * factor +
          Math.pow(distanceFromRosace, 0.6) * (1 - factor);

        const mainCircleProgress =
          distance(center, Point(x, y)) - radius * cutAboveRadius;

        if (mainCircleProgress > 0) {
          const outerProgress = Math.pow(
            0.5 +
              clamp(
                mainCircleProgress / (radius * 2),
                0,
                Number.MAX_SAFE_INTEGER
              ) *
                0.5,
            0.1
          );

          return Math.pow(
            rosaceProgress * (1 - factor) + outerProgress * factor,
            0.6
          );
        } else {
          return Math.pow(rosaceProgress, 0.7);
        }
      };

      progress.fxname = "Rosace";
      return progress;
    };

    const sineCircleProgress = () => {
      const frequency = mapRange(random.value(), 0, 1, 2.5, 4.5);
      const circles: CanvasJpPoint[] = [center];
      if (
        random.value() > 0.2 &&
        distance(center, Point(width / 2, height / 2)) >
          Math.min(width, height) / 7
      ) {
        circles.push(
          translateVector(
            distance(center, Point(width / 2, height / 2)) * 2,
            angle(center, Point(width / 2, height / 2)),
            center
          )
        );
      }
      const progress = (x: number, y: number): number => {
        return Math.min(
          ...circles.map((center, index) => {
            const angleForCenter = angle(Point(x, y), center);
            const distanceProgress = distance(Point(x, y), center) / 1080;
            if (isNaN(angleForCenter) || isNaN(distanceProgress)) {
              console.log("HERE", x, y);
            }
            const distanceFromCenter = clamp(
              (distance(Point(x, y), center) *
                mapRange(
                  random.noise1D(angleForCenter + distanceProgress),
                  -1,
                  1,
                  0.93,
                  1.07
                )) /
                (1080 * 0.7),
              0,
              1
            );

            const wave =
              Math.abs(
                Math.cos(Math.pow(distanceFromCenter, 1) * Math.PI * frequency)
              ) *
              (circles.length === 1
                ? 1
                : mapRange(index / (circles.length - 1), 0, 1, 0.9, 1));

            const linear = mapRange(
              Math.pow(distanceFromCenter, 2),
              0,
              1,
              0,
              1
            );

            return clamp(wave * (1 - linear) + 1 * linear, 0, 1);
          })
        );
      };

      progress.fxname = "Wave";
      return progress;
    };

    const churchProgress = () => {
      const numberOfWindows = clamp(
        Math.round(random.gaussian(6, 0.5) / 2) * 2 + 1,
        3,
        Number.MAX_SAFE_INTEGER
      );
      let paddingHorizontal = (cellWidth + gridMargin) * 2;
      let paddingVertical = (cellHeight + gridMargin) * 2;

      const widthRatio = mapRange(random.value(), 0, 1, 0.4, 0.8);
      const heightRatio = mapRange(random.value(), 0, 1, 0.6, 0.8);

      const windowWidth =
        ((width - 2 * paddingHorizontal) / numberOfWindows -
          paddingHorizontal) *
        widthRatio;
      const windowHeight = 780;

      paddingHorizontal =
        (width - windowWidth * numberOfWindows) / (numberOfWindows + 1);
      paddingVertical = (1080 - windowHeight) / 2 + (1920 - 1080) / 2;

      const windows = new Array(numberOfWindows).fill(null).map((_, index) => {
        const progress = index / (numberOfWindows - 1);
        const symmetricalProgress = Math.pow(
          progress > 0.5
            ? mapRange(progress, 0.5, 1, 1, 0)
            : mapRange(progress, 0, 0.5, 0, 1),
          2
        );

        return PolygonFromRect(
          paddingHorizontal + (windowWidth + paddingHorizontal) * index,
          paddingVertical +
            windowHeight * mapRange(symmetricalProgress, 0, 1, 0.2, 0),
          windowWidth,
          windowHeight * mapRange(symmetricalProgress, 0, 1, 0.6, 1)
        );
      });

      const distanceFromClosestPoint = (x, y) => {
        return Math.min(
          ...windows.map((window) => {
            return Math.min(
              ...window.points.map((point) => distance(point, Point(x, y)))
            );
          }),
          ...windows.map((window) => {
            const cornerBottomLeft = window.points[0];
            const cornerTopRight = window.points[2];
            return Math.min(
              x < cornerBottomLeft.x &&
                y > cornerBottomLeft.y &&
                y < cornerTopRight.y
                ? Math.abs(x - cornerBottomLeft.x)
                : Number.MAX_SAFE_INTEGER,
              x > cornerTopRight.x &&
                y > cornerBottomLeft.y &&
                y < cornerTopRight.y
                ? Math.abs(x - cornerTopRight.x)
                : Number.MAX_SAFE_INTEGER,

              y < cornerBottomLeft.y &&
                x > cornerBottomLeft.x &&
                x < cornerTopRight.x
                ? Math.abs(y - cornerBottomLeft.y)
                : Number.MAX_SAFE_INTEGER,
              y > cornerTopRight.y &&
                x > cornerBottomLeft.x &&
                x < cornerTopRight.x
                ? Math.abs(y - cornerTopRight.y)
                : Number.MAX_SAFE_INTEGER
            );
          })
        );
      };

      const progress = (x: number, y: number): number => {
        return windows.some((window) => isInPolygon(window, Point(x, y)))
          ? 0
          : Math.pow(
              distanceFromClosestPoint(x, y) /
                Math.min(
                  (windowWidth / widthRatio - windowWidth) / 2 +
                    paddingHorizontal / 2,
                  (windowHeight / heightRatio - windowHeight) / 2 +
                    paddingVertical / 2
                ),
              0.3
            );
      };

      progress.fxname = "Stained";
      return progress;
    };

    const treesProgress = () => {
      const numberOfRows = Math.round(mapRange(random.value(), 0, 1, 2, 5));

      const trees = new Array(numberOfRows).fill(null).flatMap((_, index) => {
        const rowProgress = index / numberOfRows;
        const numberOfTrees = clamp(
          Math.round(random.gaussian(index * 5 + 3, 2)),
          2,
          Number.MAX_SAFE_INTEGER
        );

        return new Array(numberOfTrees).fill(null).map((_, index) => {
          const progress = random.gaussian(index / (numberOfTrees - 1), 0.05);
          const treeWidth =
            (mapRange(random.value(), 0, 1, 0.4, 1.5) * width) / numberOfTrees;
          const treeHeight =
            mapRange(random.value(), 0, 1, 0.3, 0.5) * height +
            rowProgress * height * 0.7;
          return {
            shape: Polygon([
              Point(width * progress - treeWidth, 0),
              Point(
                width * progress +
                  treeWidth * mapRange(random.value(), 0, 1, -0.5, 0.5),
                treeHeight
              ),
              Point(width * progress + treeWidth, 0),
            ]),
            value: Math.pow(rowProgress, 0.7),
          };
        });
      });

      const progress = (x: number, y: number): number => {
        const point = Point(x, y);
        const tree = trees.find((tree) => isInPolygon(tree.shape, point));
        return tree ? tree.value : 1;
      };
      progress.fxname = "Forest";
      return progress;
    };

    const bombProgress = () => {
      const center = rotate(
        Point(width / 2, height / 2),
        (Math.PI / 2) * Math.floor(random.value() * 4),
        Point(width / 2, height / 3)
      );
      const progress = (x: number, y: number): number => {
        return inOutBounce(
          clamp(
            distance(Point(x, y), center) /
              distance(center, Point(0, height / 2)),
            0,
            1
          )
        );
      };

      progress.fxname = "Pearl";

      return progress;
    };

    const shapeProgress = () => {
      const numberOfEdges = Math.ceil(mapRange(random.value(), 0, 1, 2, 4));

      const radius = mapRange(random.value(), 0, 1, 1080 / 3, 1080 / 1.5);
      const phase = random.value() * Math.PI * 2;
      const shape = Polygon(
        new Array(numberOfEdges).fill(null).map((_, index) => {
          const progress = index / numberOfEdges;
          const angle = progress * Math.PI * 2 + phase;
          return Point(
            center.x + radius * Math.cos(angle),
            center.y + radius * Math.sin(angle)
          );
        })
      );

      const progress = (x: number, y: number): number => {
        return isInPolygon(shape, Point(x, y))
          ? 0
          : Math.pow(clamp(distance(center, Point(x, y)) / 1000, 0, 1), 0.3);
      };

      progress.fxname = "Gem";

      return progress;
    };

    const progressOptions = isGiganticSize
      ? [perlinProgress]
      : new Array<(x: number, y: number) => number>()
          .concat(
            new Array(amountOfCells > 1.5 ? 0 : isIrregularGrid ? 60 : 15).fill(
              perlinProgress
            )
          )
          .concat(new Array(isIrregularGrid ? 14 : 7).fill(circleProgress))
          .concat(new Array(isDullLight ? 0 : 7).fill(rosaceProgress()))
          .concat(
            new Array(isIrregularGrid ? 10 : 2).fill(sineCircleProgress())
          )
          .concat(new Array(invertProgress ? 0 : 3).fill(bombProgress()))
          .concat(
            new Array(!isIrregularGrid || invertProgress ? 0 : 3).fill(
              shapeProgress()
            )
          )
          //   .concat(new Array(isIrregularGrid ? 10 : 0).fill(heliceProgress()))
          .concat(
            new Array(isDullLight ? 0 : isIrregularGrid ? 6 : 3).fill(
              churchProgress()
            )
          )
          .concat(
            new Array(isIrregularGrid && hasGradient ? 6 : 0).fill(
              treesProgress()
            )
          );
    const progressForm = random.pick(progressOptions);

    const getProgress = (x: number, y: number): number => {
      const progress = Math.pow(
        clamp(
          random.gaussian(
            progressForm(x, y) * 0.8 +
              perlinProgress(x, y) * 0.1 +
              randomProgress(x, y) * 0.1,
            0.02
          ),
          0,
          1
        ),
        invertProgress ? 0.8 : 2
      );

      if (invertProgress) {
        return 1 - progress;
      } else {
        return progress;
      }
    };

    const randomNumberOfSplits = random.value();
    const shouldIncreaseNumberOfSplits =
      isGiganticSize ||
      progressForm.fxname === "Rosace" ||
      progressForm.fxname === "Wave";
    const numberOfSplits = Math.max(
      2,
      Math.round(
        mapRange(
          Math.pow(randomNumberOfSplits, 1.2),
          0,
          1,
          shouldIncreaseNumberOfSplits ? 3 : 1,
          shouldIncreaseNumberOfSplits ? 6 : 4
        ) * mapRange(random.value(), 0, 1, 1, amountOfCells)
      ) *
        (isGiganticSize
          ? 5
          : Math.pow(clamp(Math.min(maxColumns, maxRows) / 4, 0, 1), 0.5))
    );

    const rect = PolygonFromRect(0, 0, width, height).toShape(undefined, {
      color: black,
      opacity: 0.4,
      width: 1,
      style: CanvasJpStrokeStyle.round,
    });

    const makeShape = (
      shape: CanvasJpShape,
      newPoints: CanvasJpPoint[]
    ): CanvasJpShape => {
      if (shape.__type === "SmoothShape") {
        return SmoothShape(
          newPoints,
          shape.smoothness,
          shape.fill,
          shape.stroke
        );
      } else {
        return Shape(newPoints, shape.fill, shape.stroke);
      }
    };

    const shrink = (amount: number, shape: CanvasJpShape): CanvasJpShape => {
      const center = polygonCenter(Polygon(shape.points));

      const maxDistanceFromCenter = Math.max(
        ...shape.points.map((point) => distance(point, center))
      );

      const newPoints = shape.points.map((point) => {
        const distanceFromCenter =
          distance(point, center) / maxDistanceFromCenter;
        return translateVector(
          Math.min(amount * distanceFromCenter),
          angle(point, center),
          point
        );
      });

      return makeShape(shape, newPoints);
    };

    const translateOffset = (
      distance: number,
      angle: number,
      shape: CanvasJpShape
    ): CanvasJpShape => {
      const newPoints = shape.points.map((point) => {
        return translateVector(distance, angle, point);
      });

      return makeShape(shape, newPoints);
    };

    const split = (shape: CanvasJpShape): CanvasJpShape[] => {
      const sides = new Array(shape.points.length)
        .fill(null)
        .map((_, index) => index);

      let firstPick = random.pick(sides);
      let secondPick = random.pick(sides.filter((side) => side !== firstPick));

      const firstSide = Math.min(firstPick, secondPick);
      const secondSide = Math.max(firstPick, secondPick);

      const firstSplit = getInBetween(
        shape.points[firstSide],
        shape.points[(firstSide + 1) % shape.points.length],
        mapRange(random.value(), 0, 1, 0.25, 0.75)
      );
      const secondSplit = getInBetween(
        shape.points[secondSide],
        shape.points[(secondSide + 1) % shape.points.length],
        mapRange(random.value(), 0, 1, 0.25, 0.75)
      );

      return [
        makeShape(shape, [
          ...shape.points.slice(0, firstSide + 1),
          firstSplit,
          secondSplit,
          ...shape.points.slice(secondSide + 1),
        ]),
        makeShape(shape, [
          firstSplit,
          ...shape.points.slice(firstSide + 1, secondSide + 1),
          secondSplit,
        ]),
      ];
    };

    const tiltAmount =
      random.value() > 0.95 && !isGiganticSize
        ? mapRange(random.value(), 0, 1, width / 8, width / 5)
        : 0;
    const transformDirection = random.value() > 0.5 ? -1 : 1;

    const shouldMainSplit = !isGiganticSize && tiltAmount === 0;

    const numberOfMainSplits = Math.round(mapRange(random.value(), 0, 1, 3, 5));

    const mainSplits = new Array(numberOfMainSplits).fill(null).map(() => {
      const mainCenter = Point(
        mapRange(random.value(), 0, 1, 1 / 6, 5 / 6) * width,
        mapRange(random.value(), 0, 1, 1 / 6, 5 / 6) * height
      );
      const mainWidth =
        mapRange(Math.pow(random.value(), 0.5), 0, 1, 0.15, 0.35) *
        Math.max(width, height);
      const numberOfEdges = Math.ceil(mapRange(random.value(), 0, 1, 2, 4));
      let phase = (random.value() * Math.PI * 2) / numberOfEdges;
      if (phase < 0.1) {
        phase = 0.1;
      }
      return Polygon(
        new Array(numberOfEdges).fill(null).map((_, index) => {
          const progress = index / numberOfEdges;
          const angle = progress * Math.PI * 2 + phase;
          return Point(
            mainCenter.x + mainWidth * Math.cos(angle),
            mainCenter.y + mainWidth * Math.sin(angle)
          );
        })
      );
    });

    const gridShift = splitDistance * (5 - smoothFactor * 50);

    window.$fxhashFeatures = {
      "Color Style": isColoredBackground
        ? "Colored"
        : isLightPicker
        ? "Light"
        : "Dark",
      "Color Palette":
        coreColorPicker.name === "Black & White" ? "4" : paletteColors.name,
      "Color Gradients":
        hasGradient && gradientStrength > 0.05
          ? gradientStrength > 0.3
            ? "Strong"
            : "Light"
          : "None",
      "Color Cells": hasCellGradientHomogeneity ? "Close" : "Random",
      "Color Mixer": colorMixer.fxname,
      "Color Picker": coreColorPicker.name,
      Grid: isIrregularGrid ? "Irregular" : "Strict",
      Gap: splitDistance === 0 ? "None" : "Default",
      Tilt: tiltAmount ? "Tilted" : "None",
      Form: progressForm.fxname + (invertProgress ? " Inverted" : ""),
      Size: isGiganticSize
        ? "Huge"
        : Math.min(row, column) > 16
        ? "Small"
        : "Normal",
      Fêlures: mainSplits.reduce(
        (acc, polygon) => polygon.points.length + acc,
        0
      ),
    };
    console.log(window.$fxhashFeatures);

    const splitShape = (intersectionShape: {
      points: CanvasJpPoint[];
    }): ((shape: CanvasJpShape) => CanvasJpShape[]) => {
      const splitEdges = edgesFromPoints(intersectionShape.points, []);
      return (shape: CanvasJpShape) => {
        const edges = edgesFromPoints(shape.points, []);

        let mainEdgeIndex: number | null = null;
        const intersections = edges.map((edge) => {
          return splitEdges
            .map((mainEdge, index) => {
              if (mainEdgeIndex !== null && index !== mainEdgeIndex) {
                return null;
              }

              const intersection = getIntersection(edge, mainEdge);
              if (intersection) {
                mainEdgeIndex = index;
              }

              return intersection;
            })
            .find((intersection) => intersection !== null);
        });

        if (intersections.filter(Boolean).length < 2) {
          return [shape];
        }

        const firstIntersectionIndex = intersections.findIndex(Boolean);
        const secondIntersectionIndex = intersections.findIndex(
          (point, index) => index !== firstIntersectionIndex && point
        );

        const firstShape = [
          ...shape.points.slice(0, firstIntersectionIndex + 1),
          intersections[firstIntersectionIndex],
          intersections[secondIntersectionIndex],
          ...shape.points.slice(secondIntersectionIndex + 1),
        ] as CanvasJpPoint[];

        const secondShape = [
          intersections[firstIntersectionIndex],
          ...shape.points.slice(
            firstIntersectionIndex + 1,
            secondIntersectionIndex + 1
          ),
          intersections[secondIntersectionIndex],
        ] as CanvasJpPoint[];

        if (
          firstShape.some((point) => isNaN(point.x)) ||
          secondShape.some((point) => isNaN(point.x))
        ) {
          console.log("split", shape);
          console.log("intersections", intersections);

          console.log({
            first: firstShape,
            center: polygonCenter({ points: firstShape }),
          });
          console.log({
            first: secondShape,
            center: polygonCenter({ points: secondShape }),
          });
        }

        return [makeShape(shape, firstShape), makeShape(shape, secondShape)]
          .filter(
            (shape) =>
              !shape.points.every(
                (point) =>
                  point.x === shape.points[0].x && point.y === shape.points[0].y
              )
          )
          .map((cshape, index) => {
            const center = polygonCenter(cshape);
            if (isNaN(center.x)) {
              console.log("center", shape, cshape, index);
            }
            const progress = getProgress(center.x, center.y);

            if (isNaN(progress)) {
              console.log("> progress", progress);
            }

            if (isNaN(shrink(0, cshape).points[0].x)) {
              console.log("shrink", shrink(0, cshape), cshape);
            }

            return shrink(0, cshape);
          });
      };
    };

    const mainSplitShape = (intersectionShape) => {
      return ({ shape, progress, shapeWidth, shapeHeight }) => {
        return splitShape(intersectionShape)(shape).map((shape) => ({
          shape,
          progress,
          shapeWidth,
          shapeHeight,
        }));
      };
    };

    type ShapeDefinition = {
      x: number;
      y: number;
      columns: number;
      rows: number;
    }[];
    let shapeDefinitions: ShapeDefinition = [];

    if (isIrregularGrid) {
      type Grid = boolean[][];
      let grid: Grid = new Array(column)
        .fill(null)
        .map(() => new Array(row).fill(false));

      let x = Math.floor(random.value() * column);
      let y = Math.floor(random.value() * row);
      const easeSizeFactor = 0.1;
      function getCellSize(
        grid: Grid,
        x: number,
        y: number
      ): { columns: number; rows: number } {
        if (random.value() > 0.5) {
          let rows = 0;
          for (rows = 0; rows < maxRows && y + rows < row; rows++) {
            if (grid[x][y + rows]) {
              break;
            }
          }

          if (rows === 0) {
            return { columns: 0, rows: 0 };
          }

          rows = Math.ceil(Math.pow(random.value(), easeSizeFactor) * rows);

          let columns = 0;
          for (
            columns = 0;
            columns < maxColumns && x + columns < column;
            columns++
          ) {
            if (
              new Array(rows)
                .fill(null)
                .some((_, index) => grid[x + columns][y + index])
            ) {
              break;
            }
          }

          if (columns === 0) {
            return { rows: 0, columns: 0 };
          }
          columns = Math.ceil(
            Math.pow(random.value(), easeSizeFactor) * columns
          );

          return { rows, columns };
        } else {
          let columns = 0;
          for (
            columns = 0;
            columns < maxColumns && x + columns < column;
            columns++
          ) {
            if (grid[x + columns][y]) {
              break;
            }
          }

          if (columns === 0) {
            return { columns: 0, rows: 0 };
          }

          columns = Math.ceil(
            Math.pow(random.value(), easeSizeFactor) * columns
          );

          let rows = 0;
          for (rows = 0; rows < maxRows && y + rows < row; rows++) {
            if (
              new Array(columns)
                .fill(null)
                .some((_, index) => grid[x + index][y + rows])
            ) {
              break;
            }
          }

          if (rows === 0) {
            return { rows: 0, columns: 0 };
          }
          rows = Math.ceil(Math.pow(random.value(), easeSizeFactor) * rows);

          return { rows, columns };
        }
      }

      function getFirstEmptyPosition(grid) {
        for (let x = 0; x < column; x++) {
          for (let y = 0; y < row; y++) {
            if (!grid[x][y]) {
              return { x, y };
            }
          }
        }
        return null;
      }

      let shouldContinue = true;
      while (shouldContinue) {
        if (x >= column && y >= row) {
          let emptyPosition = getFirstEmptyPosition(grid);
          if (emptyPosition) {
            x = emptyPosition.x;
            y = emptyPosition.y;
            continue;
          } else {
            shouldContinue = false;
            continue;
          }
        }

        if (x >= column) {
          x = 0;
          y++;
          continue;
        }
        if (grid[x][y]) {
          x++;
          continue;
        }

        let { columns, rows } = getCellSize(grid, x, y);

        if (rows === 0) {
          x++;
          continue;
        }

        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            grid[x + i][y + j] = true;
          }
        }

        shapeDefinitions.push({
          x,
          y,
          rows,
          columns,
        });

        x = Math.floor(random.value() * column);
        y = Math.floor(random.value() * row);
      }
    } else {
      shapeDefinitions = new Array(row * column).fill(null).map((_, index) => {
        const x = index % column;
        const y = Math.floor(index / column);
        return {
          x,
          y,
          columns: 1,
          rows: 1,
        };
      });
    }

    let shapes: {
      progress: number;
      shapeWidth: number;
      shapeHeight: number;
      shape: CanvasJpShape;
      color: CanvasJpColorHsv;
      firstColor: CanvasJpColorHsv;
    }[] = shapeDefinitions
      .map(({ x, y, columns, rows }, index) => {
        const shapeX = (cellWidth + gridMargin) * x;
        const shapeY = (cellHeight + gridMargin) * y;

        const shapeWidth = (cellWidth + gridMargin) * columns - gridMargin;
        const shapeHeight = (cellHeight + gridMargin) * rows - gridMargin;

        const progress = getProgress(
          shapeX + shapeWidth / 2,
          shapeY + shapeHeight / 2
        );

        return {
          shape: PolygonFromRect(
            shapeX,
            shapeY,
            shapeWidth,
            shapeHeight
          ).toShape(rect.fill || undefined, rect.stroke || undefined),
          progress,
          shapeWidth,
          shapeHeight,
        };
      })
      .map(({ shape, progress, shapeWidth, shapeHeight }) => {
        const newShape = makeShape(
          shape,
          shape.points.map((point) => {
            const yProgress = point.y / height;
            const tiltedX = point.x + tiltAmount * yProgress;
            const biggerWidthRatio =
              (width + 2 * tiltAmount) / (width - tiltAmount);
            const newX = tiltedX * biggerWidthRatio - 2 * tiltAmount;

            if (transformDirection === -1) {
              return Point((1 - newX / width) * width, point.y);
            } else {
              return Point(newX, point.y);
            }
          })
        );

        return {
          shape: newShape,
          shapeWidth: shapeWidth,
          shapeHeight: shapeHeight,
          progress: 1,
        };
      })
      .flatMap(({ shape, progress, shapeWidth, shapeHeight }) => {
        if (!shouldMainSplit) {
          return [{ shape, progress, shapeWidth, shapeHeight }];
        }

        let result = [{ shape, progress, shapeWidth, shapeHeight }];
        for (let mainSplit of mainSplits) {
          result = result.flatMap(mainSplitShape(mainSplit));
        }
        return result;
      })
      .filter(({ progress }) => {
        return progress !== -1;
      })
      .map(({ shape, shapeWidth, shapeHeight }) => {
        const center = polygonCenter(shape);
        return {
          shape,
          progress: getProgress(center.x, center.y),
          shapeWidth,
          shapeHeight,
        };
      })
      .map(({ shape, progress, shapeWidth, shapeHeight }, index) => {
        const center = polygonCenter(shape);
        const newProgress = getProgress(center.x, center.y);
        const numberOfMainSplitsShapes = mainSplits.reduce(
          (amount, mainSplit) =>
            isInPolygon(mainSplit, center) ? 1 : 0 + amount,
          0
        );
        const factor = Math.pow(
          1 - numberOfMainSplitsShapes / mainSplits.length,
          3
        );
        progress = newProgress * factor;

        const color = colorPicker.getMainColor();
        const firstColor = colorPicker.getSecondColor(
          color,
          Math.pow(progress, 1)
        );

        return {
          progress,
          shape,
          shapeWidth,
          shapeHeight,
          color: color,
          firstColor: firstColor,
        };
      });

    for (let i = 0; i < numberOfSplits; i++) {
      shapes = shapes
        .flatMap(({ shape, shapeWidth, shapeHeight, color, firstColor }) => {
          try {
            if (isNaN(shape.points[0].x)) {
              console.log(shape);
            }
            const center = polygonCenter(Polygon(shape.points));
            const newProgress = getProgress(center.x, center.y);
            if (isNaN(newProgress)) {
              console.log("newProgress", center.x, center.y);
            }
            const newShapes =
              random.value() > random.gaussian(newProgress, 0.1) &&
              polygonArea(shape) >
                Math.max(
                  cellHeight * maxRows * cellWidth * maxColumns * 0.2,
                  30 * 30
                )
                ? split(shape)
                : [shape];
            return newShapes.map((shape) => ({
              shape,
              progress: Math.pow(newProgress, 2),
              shapeWidth,
              shapeHeight,
              color,
              firstColor,
            }));
          } catch (e) {
            console.log(polygonCenter(Polygon(shape.points)), shape);
            throw e;
          }
        })
        .map(
          ({ shape, progress, shapeWidth, shapeHeight, color, firstColor }) => {
            return {
              progress,
              shape: shrink(gridShift, shape),
              shapeWidth,
              shapeHeight,
              color,
              firstColor,
            };
          }
        )
        .map(
          ({ shape, progress, shapeWidth, shapeHeight, color, firstColor }) => {
            const maxDistance =
              splitDistance *
              offsetFactor *
              mapRange(Math.pow(progress, 0.4), 0, 1, 0.2, 0.1);
            shape = translateOffset(
              mapRange(random.value(), 0, 1, 0, maxDistance),
              mapRange(random.value(), 0, 1, 0, Math.PI * 2),
              shape
            );

            return {
              progress,
              shape,
              shapeWidth,
              shapeHeight,
              color,
              firstColor,
            };
          }
        );
    }

    shapes = shapes.flatMap(
      ({ shape, progress, shapeWidth, shapeHeight, color, firstColor }) => {
        const newShapes =
          random.value() > 0.8 &&
          progress < 0.01 &&
          polygonArea(shape) < (shapeWidth * shapeHeight) / 8
            ? split(shape)
            : [shape];
        return newShapes.map((shape) => ({
          progress,
          shape: shape,
          shapeWidth,
          shapeHeight,
          color,
          firstColor,
        }));
      }
    );

    const makeGradient = (
      color: CanvasJpColorHsv,
      firstColor: CanvasJpColorHsv,
      progress: number
    ): CanvasJpGradient => {
      let gradientStart, gradientEnd;
      if (hasCellGradientHomogeneity) {
        gradientStart = colorMixer(
          firstColor,
          colorPicker.getSecondColor(color, progress),
          1 - gradientStrength
        );
        gradientEnd = colorMixer(
          colorPicker.getSecondColor(color, progress),
          firstColor,
          clamp(random.gaussian(gradientStrength, 0.1), 0, 1)
        );
      } else {
        const mainColor = colorPicker.getMainColor();
        gradientStart = colorPicker.getSecondColor(mainColor, progress);
        gradientEnd = colorMixer(
          colorPicker.getSecondColor(color, progress),
          firstColor,
          clamp(random.value() * (1 - progress), 0, 1)
        );
      }
      const gradientSteps = 2;

      return Gradient(
        new Array(gradientSteps)
          .fill(null)
          .map((_, index) =>
            colorMixer(gradientStart, gradientEnd, index / (gradientSteps - 1))
          ),
        gradientAngle + (random.value() * Math.PI) / 2
      );
    };

    let elements = shapes
      .map(({ shape, shapeWidth, shapeHeight, color, firstColor }) => {
        // const color = colorPicker.getMainColor();
        const bigRatio = Math.pow(
          1 - polygonArea(shape) / (shapeWidth * shapeHeight),
          1
        );

        const center = polygonCenter(shape);
        const newProgress = Math.pow(getProgress(center.x, center.y), 1.5);

        return SmoothShape(shape.points, smoothFactor * bigRatio, {
          color: hasGradient
            ? makeGradient(color, firstColor, newProgress)
            : colorPicker.getSecondColor(color, newProgress),
          opacity: isColorful
            ? clamp(mapRange(Math.pow(newProgress, 0.2), 0, 1, 2, -0.3), 0, 1)
            : 1 - newProgress * 0.5,
        });
      })
      .filter(Boolean) as CanvasJpShape[];

    const windowRatio = windowWidth / windowHeight;
    const maxWindowSize = Math.max(windowWidth, windowHeight);
    const offset = (windowWidth - windowHeight) / 2;
    const gridOffset = offset - Math.floor(offset / cellHeight) * cellHeight;
    let windowOffset: CanvasJpPoint;
    if (windowRatio > 1) {
      windowOffset = Point(0, offset);
    } else {
      windowOffset = Point(-offset, 0);
    }
    const margin = Math.min(windowWidth, windowHeight) / 30;

    elements.sort((a, b) => {
      const diff = (a.fill?.opacity || 0) - (b.fill?.opacity || 0);

      let result: number;
      if (Math.abs(diff) > 0.001) {
        result = diff;
      } else {
        result =
          distance(polygonCenter(Polygon(a.points)), center) -
          distance(polygonCenter(Polygon(b.points)), center);
      }
      if (isLightPicker) {
        return -result;
      } else {
        return -result;
      }
    });

    const mainColor = colorPicker.getMainColor();
    const tint = random.gaussian(0, 0.4);

    let amountOfLight = 0;
    const numberOfShapes = Math.round(700 * (isGiganticSize ? 0.2 : 1));

    const tinyCircles = new Array<CanvasJpArc>();

    new Array(numberOfShapes).fill(null).flatMap(() => {
      const sizeRatio = Math.pow(random.value(), 1.5);
      const tinyShapesSize = mapRange(sizeRatio, 0, 1, width / 80, width / 10);

      const center = Point(random.value() * width, random.value() * height);

      const progress = getProgress(center.x, center.y);
      if (progress > 0.2) {
        return [];
      }

      let color = colorPicker.getSecondColor(mainColor, progress);
      color = Color(
        colorPickerFactory === blackAndWhite
          ? mainHue
          : (color.h + tint + 1) % 1,
        colorPickerFactory === blackAndWhite ? 0.2 : color.s,
        color.v
      );
      let gradientColors = new Array(4).fill(null).map(() => color);
      const valueOffset = Math.abs(random.gaussian(0, 0.1));
      const valueFactor = isLightPicker ? 1 : 1.1;
      const saturationFactor = isLightPicker ? 1 : 1.1;
      const hueOffset =
        colorPickerFactory === duochrome ? random.gaussian(0, 0.15) : 0;
      gradientColors = gradientColors.map((color, index) => {
        return Color(
          color.h + hueOffset,
          (color.s > 0.8
            ? color.s * 0.9
            : color.s < 0.4
            ? color.s * 1.3
            : color.s) * saturationFactor,
          clamp((color.v - valueOffset) * valueFactor, 0, 1),
          inOutCirc(mapRange(index / (gradientColors.length - 1), 0, 1, 1, 0))
        );
      });

      const gradientValue = color.v;

      const shouldLighten = !(gradientValue > 0.8 && random.value() > 0.9);

      if (shouldLighten) {
        amountOfLight += Math.pow(gradientValue, 2) * Math.sqrt(sizeRatio);
      } else {
        amountOfLight += 0.4 * Math.sqrt(tinyShapesSize);
      }

      if (
        amountOfLight >
        (isColoredBackground
          ? 100 * colorPicker.getBackgroundColor().v
          : progressOptions.fxname === "Shape"
          ? 120
          : isLightPicker
          ? 200
          : colorPickerFactory === blackAndWhite
          ? 40
          : 350) *
          (colorPicker.getBackgroundColor().v > 0.8 ? 0.3 : 1) *
          (hasGradient ? 1 : 0.4)
      ) {
        return [];
      }

      const shouldOverlay = gradientValue > (isColoredBackground ? 0.7 : 0.45);

      if (!shouldOverlay) {
        return;
      }

      const overlayBlur = clamp(
        Math.pow(tinyShapesSize / 2, 1.3),
        5,
        Number.MAX_SAFE_INTEGER
      );

      const opacityRatio = Math.pow(mapRange(sizeRatio, 0, 1, 0, 1), 3);

      tinyCircles.push(
        Circle(center, overlayBlur, {
          color: RadialGradient(gradientColors, center, overlayBlur),
          opacity:
            (isLightPicker ? 0.35 : 0.25) *
            (1 - Math.pow(gradientValue, 0.5) * opacityRatio),
          compositionOperation: "overlay",
        })
      );

      if (shouldLighten) {
        const lighterBlur = clamp(
          Math.pow(tinyShapesSize / 3, 1.8),
          5,
          Number.MAX_SAFE_INTEGER
        );

        const lightCenter = translate(
          random.value() * lighterBlur * 0.1,
          random.value() * Math.PI * 2,
          center
        );

        tinyCircles.push(
          Circle(lightCenter, lighterBlur, {
            color: RadialGradient(gradientColors, lightCenter, lighterBlur),
            opacity:
              (isLightPicker ? 0.01 : 0.025) *
              (1 - Math.pow(gradientValue, 2) * opacityRatio),
            compositionOperation: "soft-light",
          })
        );
      }
    });

    let mainElementsLength = elements.length;

    const verticalMargin = windowRatio > 1 ? gridOffset / 2 : 0;
    const horizontalMargin = windowRatio > 1 ? gridOffset / 2 : 0;
    const mapToWindow = <T extends CanvasJpShape | CanvasJpArc>(
      elements: T[]
    ): T[] => {
      const inFrameThreshold = 0.35;

      const scale = (value) => {
        return mapRange(value, 0, 1920, margin, maxWindowSize - margin);
      };

      const move = (point: CanvasJpPoint) => {
        // scale to window
        const scaledPoint = Point(
          scale(point.x) + horizontalMargin,
          scale(point.y) + verticalMargin
        );
        // center to window
        return Point(
          scaledPoint.x - windowOffset.x,
          scaledPoint.y - windowOffset.y
        );
      };

      const mapFill = (fill: CanvasJpFill) => {
        if (fill.color.__type === "RadialGradient") {
          return {
            ...fill,
            color: RadialGradient(
              fill.color.colors,
              move(fill.color.center),
              scale(fill.color.radius)
            ),
          };
        } else {
          return fill;
        }
      };

      const scaledShapes = elements
        .map((shape) => {
          if (shape.__type === "Arc") {
            return new Array<CanvasJpArc>(
              Circle(
                move(shape.center),
                scale(shape.radius),
                shape.fill ? mapFill(shape.fill) : shape.fill
              )
            );
          } else {
            const movedShape = makeShape(shape, shape.points.map(move));

            return splitShape({
              points: [
                Point(margin + horizontalMargin, margin + verticalMargin),
                Point(
                  windowWidth - horizontalMargin - margin,
                  verticalMargin + margin
                ),
                Point(
                  windowWidth - horizontalMargin - margin,
                  windowHeight - verticalMargin - margin
                ),
                Point(
                  horizontalMargin + margin,
                  windowHeight - verticalMargin - margin
                ),
              ],
            })(movedShape);
          }
        })
        .flat() as T[];

      return scaledShapes.filter((shape) => {
        const points = shape.__type === "Arc" ? [shape.center] : shape.points;
        const isInFrame = points.reduce((acc, point) => {
          const isClearlyOutOfFrame =
            point.x < (horizontalMargin + margin) * (1 - inFrameThreshold) ||
            point.x >
              windowWidth -
                (horizontalMargin + margin) * (1 - inFrameThreshold) ||
            point.y < (verticalMargin + margin) * (1 - inFrameThreshold) ||
            point.y >
              windowHeight - (verticalMargin + margin) * (1 - inFrameThreshold);
          const isClearlyInsideOfFrame =
            point.x > (horizontalMargin + margin) * (1 + inFrameThreshold) &&
            point.x <
              windowWidth -
                (horizontalMargin + margin) * (1 + inFrameThreshold) &&
            point.y > (verticalMargin + margin) * (1 + inFrameThreshold) &&
            point.y <
              windowHeight - (verticalMargin + margin) * (1 + inFrameThreshold);

          const outOfFrameAmount = isClearlyInsideOfFrame
            ? 1000
            : isClearlyOutOfFrame
            ? -1000
            : 1;

          return acc + outOfFrameAmount;
        }, 0);

        return isInFrame > 50;
      });
    };

    const frames = Math.round(1000 / 60);

    let themeColor = document.querySelector("meta[name=theme-color]");
    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.setAttribute("name", "theme-color");
      document.head.append(themeColor);
    }
    themeColor.setAttribute("content", colorPicker.getBackgroundColor().hex());
    const background = colorPicker.getBackgroundColor();
    document.body.style.backgroundColor = colorPicker
      .getBackgroundColor()
      .hex();
    document.body.style.setProperty(
      "--color",
      Color(background.h, background.s, background.v > 0.5 ? 0.2 : 0.8).hex()
    );
    document.body.style.setProperty(
      "--actions-color",
      Color(background.h, background.s * 0.1, 1).hex()
    );

    yield {
      background: colorPicker.getBackgroundColor(),
      elements: [],
    };

    elements = mapToWindow<CanvasJpShape>(elements);
    const drawElements = function* (elements: CanvasJpDrawable[]) {
      const increment = Math.ceil(mainElementsLength / (frames - 1));
      let latestElementDrawn = 0;
      for (let i = 0; i < mainElementsLength; i += increment) {
        const start = i;
        latestElementDrawn = Math.min(i + increment, mainElementsLength);

        yield {
          elements: new Array().concat(
            elements.slice(start, latestElementDrawn)
          ),
        };
      }

      yield {
        elements: elements.slice(latestElementDrawn, mainElementsLength),
      };
    };

    for (let frame of drawElements(elements)) {
      yield frame;
    }

    for (let frame of drawElements(mapToWindow(tinyCircles))) {
      yield frame;
    }

    yield {
      elements: [
        UpdateImageData((imageData) => {
          for (let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.pow(
              (imageData.data[i] +
                imageData.data[i + 1] +
                imageData.data[i + 2]) /
                256 /
                3,
              0.3
            );
            const x = ((i - (i % 4)) / resolution) % width;
            const y = Math.floor((i - (i % 4)) / resolution / width);
            const gA =
              0.04 *
              Math.pow(mapRange(random.noise2D(x, y, 0.1), -1, 1, 0, 1), 2);

            const darker = mapRange(
              Math.pow(mapRange(random.noise2D(x, y, 0.01), -1, 1, 0, 1), 0.3),
              0,
              1,
              mapRange(Math.pow(value, 0.5), 0, 1, 0.8, 1),
              1
            );
            const noise = random.gaussian(
              1,
              gA * mapRange(Math.pow(value, 3), 0, 1, 2, 0.7)
            );
            imageData.data[i] = clamp(
              Math.round(imageData.data[i] * darker * noise),
              0,
              255
            );
            imageData.data[i + 1] = clamp(
              Math.round(imageData.data[i + 1] * darker * noise),
              0,
              255
            );
            imageData.data[i + 2] = clamp(
              Math.round(imageData.data[i + 2] * darker * noise),
              0,
              255
            );
            imageData.data[i + 3] = imageData.data[i + 3];
          }

          return imageData;
        }),
      ],
    };
  },
  () => {
    const params = new URLSearchParams(window.location.search);

    const windowRatio = window.innerWidth / window.innerHeight;
    let width = Number(params.get("width")) || window.innerWidth;
    let height = width / windowRatio;

    var isFxpreview = params.get("preview") === "1";
    if (isFxpreview) {
      width = Number(params.get("width")) || 1920;
      height = (width * 21) / 29.7;
    }

    const imageRatio = width / height;
    const resolutionFactor =
      windowRatio > imageRatio
        ? window.innerHeight / height
        : window.innerWidth / width;

    let resolution = params.get("width") || isFxpreview ? 1 : resolutionFactor;

    if (
      Math.max(width, height) * resolution < 1920 &&
      window.devicePixelRatio < 2
    ) {
      resolution *= 2;
    }

    return {
      width: width,
      height: height,
      resolution: resolution,
      interactive: false,
      plugins: [fxhashCollection(hashes), prodMode("Felure-JulienPradet")],
    };
  }
);

function polygonCenter({ points }: { points: CanvasJpPoint[] }): CanvasJpPoint {
  let sum = points.slice(1).reduce(({ x, y }, point) => {
    return Point(x + point.x, y + point.y);
  }, points[0]);

  return Point(sum.x / points.length, sum.y / points.length);
}
