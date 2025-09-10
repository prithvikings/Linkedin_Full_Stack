import React, { useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { useContext } from "react";
import { UserDataCtx } from "../context/UserContext";
import { useState } from "react";
import { Auth } from "../context/AuthContext";
const Editprofile = () => {
  const { UserData, editProfileOpen, setEditProfileOpen } =
    useContext(UserDataCtx);
  const { serverUrl } = useContext(Auth);

  const handleeditProfileOpen = () => {
    setEditProfileOpen(!editProfileOpen);
  };

  let [firstname, setFirstname] = useState(UserData.firstname || "");
  let [lastname, setLastname] = useState(UserData.lastname || "");
  let [email, setEmail] = useState(UserData.email || "");
  let [location, setLocation] = useState(UserData.location || "");
  let [headline, setHeadline] = useState(UserData.headline || "");
  let [bio, setBio] = useState(UserData.bio || "");
  const profileImage = useRef();
  const coverImage = useRef();

  let [frontendprofilePic, frontendsetProfilePic] = useState(
    UserData.profilePic || null
  );
  let [backendprofilePic, backendsetProfilePic] = useState(null);
  let [frontendcoverPic, frontendsetCoverPic] = useState(
    UserData.coverPic || null
  );
  let [backendcoverPic, backendsetCoverPic] = useState(null);

  const [loading, setLoading] = useState(false);

  // Skills
  let [newskills, setnewSkills] = useState([]);
  let [skills, setSkills] = useState(
    UserData.skills ? UserData.skills.join(", ") : ""
  );

  // Education
  let [education, setEducation] = useState(UserData.education || []);
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldofstudy: "",
    startyear: "",
    endyear: "",
  });

  // Experience
  let [experiences, setExperiences] = useState(UserData.experiences || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  if (!editProfileOpen) return null;

  // ---------------- Skills Functions ----------------

  const handleAddSkill = () => {
    if (newskills && !skills.includes(newskills)) {
      const updatedSkills = skills ? skills + ", " + newskills : newskills;
      setSkills(updatedSkills);
      setnewSkills("");
    }
  };

  const handleAddedSkill = (skillToRemove) => {
    const updatedSkillsArray = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkillsArray.join(", "));
  };

  // ---------------- Education Functions ----------------
  const handleAddEducation = () => {
    if (
      newEducation.college &&
      newEducation.degree &&
      newEducation.fieldofstudy
    ) {
      setEducation([...education, newEducation]);
      setNewEducation({
        college: "",
        degree: "",
        fieldofstudy: "",
        startyear: "",
        endyear: "",
      });
    }
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  // ---------------- Experience Functions ----------------
  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      setExperiences([...experiences, newExperience]);
      setNewExperience({
        title: "",
        company: "",
        description: "",
      });
    }
  };
  const handleRemoveExperience = (index) => {
    const updatedExp = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExp);
  };

  //Image Handlers
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      frontendsetProfilePic(URL.createObjectURL(file));
      backendsetProfilePic(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      frontendsetCoverPic(URL.createObjectURL(file));
      backendsetCoverPic(file);
    }
  };

  const handlesaveProfile = async () => {
    try {
      setLoading(true); // disable button immediately

      let form = new FormData();
      form.append("firstname", firstname);
      form.append("lastname", lastname);
      form.append("email", email);
      form.append("location", location);
      form.append("headline", headline);
      form.append("bio", bio);
      form.append("skills", skills);
      form.append("education", JSON.stringify(education));
      form.append("experiences", JSON.stringify(experiences));
      if (backendprofilePic) form.append("profilePic", backendprofilePic);
      if (backendcoverPic) form.append("coverPic", backendcoverPic);

      let result = await fetch(serverUrl + "/api/user/updateprofile", {
        method: "PUT",
        body: form,
        credentials: "include",
      });

      let res = await result.json();

      if (res.success) {
        setEditProfileOpen(false); // close modal
      } else {
        alert(res.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false); // always re-enable button
    }
  };

  return (
    <div className="fixed w-full h-[100vh] top-0 z-[100] flex justify-center items-center">
      <input
        type="file"
        accept="image/*"
        ref={profileImage}
        onChange={handleProfileImageChange}
      />
      <input
        type="file"
        accept="image/*"
        ref={coverImage}
        onChange={handleCoverImageChange}
      />
      <div className="w-full h-full bg-black opacity-[0.5] absolute"></div>
      <div className="w-[90%] max-w-[500px] max-h-[90vh] bg-white absolute z-[200] shadow-lg rounded-lg p-4 overflow-y-auto">
        <div>
          <RxCross1
            className="absolute top-4 right-4 cursor-pointer"
            onClick={handleeditProfileOpen}
          />
        </div>
        <div
          onClick={() => coverImage.current.click()}
          className="bg-gray-400 mt-10 w-full h-32 rounded-md cursor-pointer"
        >
          {frontendcoverPic && (
            <img
              src={frontendcoverPic}
              alt="Cover"
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>
        <div
          onClick={() => profileImage.current.click()}
          className="bg-gray-800 -mt-8 ml-4 w-20 h-20 rounded-full cursor-pointer"
        >
          {frontendprofilePic && (
            <img
              src={frontendprofilePic}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-white"
            />
          )}
        </div>

        <form action="" onSubmit={(e) => e.preventDefault()}>
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstname">First Name</label>
              <input
                onChange={(e) => setFirstname(e.target.value)}
                type="text"
                id="firstname"
                className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                value={firstname}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastname">Last Name</label>
              <input
                onChange={(e) => setLastname(e.target.value)}
                type="text"
                id="lastname"
                className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                value={lastname}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="Email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="Email"
                className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                value={email}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="Email">Location</label>
              <input
                onChange={(e) => setLocation(e.target.value)}
                type="Location"
                id="Location"
                className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                value={location}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="headline">Headline</label>
              <input
                onChange={(e) => setHeadline(e.target.value)}
                type="text"
                id="headline"
                className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                value={headline}
              />
            </div>

            {/* Skills Section */}
            <div className="flex flex-col gap-2">
              <label htmlFor="skills">Skills</label>

              {/* Render skills as chips */}
              <div className="flex flex-wrap">
                {skills &&
                  skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-4 py-2 rounded-full mr-2 mb-2 flex items-center gap-2 hover:bg-blue-200 cursor-pointer"
                    >
                      {skill.trim()}
                      <span
                        className="cursor-pointer"
                        onClick={() => handleAddedSkill(skill.trim())} // pass skill directly
                      >
                        <RxCross1 />
                      </span>
                    </span>
                  ))}
              </div>

              {/* Input for new skill */}
              <input
                onChange={(e) => setnewSkills(e.target.value)}
                type="text"
                id="skills"
                className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                value={newskills}
              />
              <button
                onClick={handleAddSkill}
                type="button" // important to avoid form submit
                className="bg-green-600 text-white py-2 cursor-pointer px-2 rounded-md mt-2 w-1/4 hover:bg-green-700 transition duration-300"
              >
                Add Skill
              </button>
            </div>

            {/* Education */}
            <div className="flex flex-col gap-2">
              <label>Education</label>

              {/* Existing education list */}
              <div className="flex flex-col gap-2">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="p-2 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{edu.college}</p>
                      <p className="text-sm text-gray-600">
                        {edu.degree} - {edu.fieldofstudy}
                      </p>
                      <p className="text-xs text-gray-500">
                        {edu.startyear} - {edu.endyear}
                      </p>
                    </div>
                    <RxCross1
                      className="cursor-pointer"
                      onClick={() => handleRemoveEducation(index)}
                    />
                  </div>
                ))}
              </div>

              {/* Add new education */}
              <input
                type="text"
                placeholder="College"
                className="border p-2 rounded-md"
                value={newEducation.college}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, college: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Degree"
                className="border p-2 rounded-md"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Field of Study"
                className="border p-2 rounded-md"
                value={newEducation.fieldofstudy}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldofstudy: e.target.value,
                  })
                }
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Start Year"
                  className="border p-2 rounded-md w-1/2"
                  value={newEducation.startyear}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      startyear: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="End Year"
                  className="border p-2 rounded-md w-1/2"
                  value={newEducation.endyear}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      endyear: e.target.value,
                    })
                  }
                />
              </div>
              <button
                onClick={handleAddEducation}
                type="button"
                className="bg-green-600 text-white cursor-pointer py-2 px-2 rounded-md mt-2 w-1/2 hover:bg-green-700 transition duration-300"
              >
                Add Education
              </button>
            </div>

            {/* EXPERIENCE */}
            <div className="flex flex-col gap-2">
              <label>Experience</label>
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2"
                >
                  <div>
                    <p className="font-semibold">
                      {exp.title} @ {exp.company}
                    </p>
                    <p className="text-sm">{exp.description}</p>
                  </div>
                  <RxCross1
                    className="cursor-pointer"
                    onClick={() => handleRemoveExperience(index)}
                  />
                </div>
              ))}
              <input
                type="text"
                placeholder="Job Title"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                className="border border-gray-300 rounded-md p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Company"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-2 mb-2"
              />
              <textarea
                placeholder="Description"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-2 mb-2"
              />
              <button
                onClick={handleAddExperience}
                type="button"
                className="bg-green-600 hover:bg-green-700 cursor-pointer transition duration-300 text-white py-2 px-2 rounded-md mt-2 w-1/3"
              >
                Add Experience
              </button>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label htmlFor="bio">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                id="bio"
                className="border border-gray-300 rounded-md p-2 resize-none outline-none focus:border-blue-500"
                value={bio}
              ></textarea>
            </div>
            <button
              disabled={loading}
              onClick={handlesaveProfile}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 rounded-md mt-4 transition duration-300`}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editprofile;
