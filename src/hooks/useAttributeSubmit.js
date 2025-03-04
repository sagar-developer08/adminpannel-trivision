import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

//internal import
import { SidebarContext } from "../context/SidebarContext";
import AttributeServices from "../services/AttributeServices";
import { notifyError, notifySuccess } from "../utils/toast";
import useToggleDrawer from "./useToggleDrawer";

const useAttributeSubmit = (id) => {
  const location = useLocation();
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [variants, setVariants] = useState([]);
  const [language, setLanguage] = useState(lang);
  const [resData, setResData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setServiceId } = useToggleDrawer();

  let variantArrayOfObject = [];

  for (let i = 0; i < variants.length; i++) {
    variantArrayOfObject = [
      ...variantArrayOfObject,
      {
        name: {
          [language]: variants[i],
        },
      },
    ];
  }

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({
    name,
    slug,
    title,
    content,
    meta_title,
    meta_description,
  }) => {
    try {
      setIsSubmitting(true);
      if (!id) {
        if (!name) {
          notifyError("Add brand name!");
          return;
        }
      }
      const attributeData = {
        name: name,
        slug: slug,
        title: title,
        content: content,
        brand_logo: imageUrl,
        meta_title: meta_title,
        meta_description: meta_description,
      };

      console.log("attributeData", attributeData);

      if (id) {
        const res = await AttributeServices.updateAttributes(id, attributeData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setServiceId();
      } else {
        const res = await AttributeServices.addAttribute(attributeData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setServiceId();
      }
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
      closeDrawer();
      setIsSubmitting(false);
      setServiceId();
    }
  };

  // child attribute
  const onSubmits = async ({ name }) => {
    try {
      setIsSubmitting(true);
      if (id) {
        const res = await AttributeServices.updateChildAttributes(
          { ids: location.pathname.split("/")[2], id },
          {
            name: {
              [language]: name,
            },
            status: published ? "show" : "hide",
          }
        );
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await AttributeServices.addChildAttribute(
          location.pathname.split("/")[2],
          {
            name: {
              [language]: name,
            },
            status: published ? "show" : "hide",
          }
        );
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
      closeDrawer();
      setIsSubmitting(false);
      setServiceId();
    }
  };

  // const handleSelectLanguage = (lang) => {
  //   setLanguage(lang);
  // };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("title", resData.title[lang ? lang : "en"]);
      setValue("name", resData.name[lang ? lang : "en"]);
      // console.log('change lang', lang);
    }
  };

  const removeVariant = (indexToRemove) => {
    setVariants([...variants.filter((_, index) => index !== indexToRemove)]);
  };

  const addVariant = (e) => {
    e.preventDefault();
    if (e.target.value !== "") {
      setVariants([...variants, e.target.value]);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      setValue("slug");
      setValue("title");
      setValue("content");
      setValue("brand_logo");
      setValue("option");
      clearErrors("name");
      clearErrors("slug");
      clearErrors("title");
      clearErrors("content");
      clearErrors("brand_logo");
      clearErrors("option");
      setVariants([]);
      setImageUrl("");
      setLanguage(lang);
      setValue("language", language);
      return;
    }

    if (location.pathname === "/attributes" && id) {
      (async () => {
        try {
          const res = await AttributeServices.getAttributeById(id);
          if (res) {
            setResData(res);
            setValue("name", res.name);
            setValue("slug", res.slug);
            setValue("title", res.title);
            setValue("content", res.content);
            setValue("brand_logo", res.brand_logo);
            setImageUrl(res.brand_logo);
            setValue("option", res.categories);
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err.message);
        }
      })();
    } else if (
      location.pathname === `/attributes/${location.pathname.split("/")[2]}`
    ) {
      (async () => {
        try {
          const res = await AttributeServices.getChildAttributeById({
            id: location.pathname.split("/")[2],
            ids: id,
          });
          if (res) {
            // console.log('res child', res);
            setValue("name", res.name[language ? language : "en"]);
            setPublished(res.status === "show" ? true : false);
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err.message);
        }
      })();
    }
  }, [clearErrors, id, isDrawerOpen, setValue, location, language, lang]);

  return {
    handleSubmit,
    onSubmits,
    onSubmit,
    register,
    errors,
    variants,
    setVariants,
    addVariant,
    removeVariant,
    published,
    setPublished,
    isSubmitting,
    handleSelectLanguage,
    imageUrl,
    setImageUrl,
  };
};

export default useAttributeSubmit;
