var vietID = 0;

var mEmail = '';
function GuiTinCheckLogin(isRedirect) {
    $.getScript("http://vietid.net/login/Checksession");
    mingAuthCallBack = function (data) {
        var img = new Image();
        if (data != 'null') {
            $.cookie("GTCheckLogin", true, { expires: 30, path: '/' });

            var rels = eval('(' + data + ')');
            var info = 'id=' + rels.id + '&username=' + rels.username + '&email=' + rels.email + '&full_name=' + rels.full_name + '&avatar=' + rels.avatar + '&checksum=' + rels.checksum;

            vietID = rels.id;

            $.getScript(apiLiveUrl + "/ajax/dologinx.aspx?" + info);
            //  $.getScript(ajaxDomainGt + "/Handlers/dologin.aspx?" + info);
            loginCallback = function (res) {
                GuiTinBindData(res);


            };
        } else {
            $.cookie("GTCheckLogin", false, { expires: 30, path: '/' });
            // $.getScript(ajaxDomainGt + "/Handlers/dologin.aspx");
            img.src = apiLiveUrl + '/ajax/dologinx.aspx';
            if (isRedirect) {
                window.location.href = '/gui-tin-nhanh.chn?act=login';
            }
        }

        //GuiTin_LoginCallback
        if (typeof (GuiTin_LoginCallback) == 'function') {
            GuiTin_LoginCallback(data);
        }
    };
}
function removeSignOutVietIdStatus() {
}
function reloadIFrame() {
}
function dologinx(cb) {
    $.getScript("http://vietid.net/login/Checksession");
    mingAuthCallBack = function (data) {
        if (data != 'null') {
            var rels = eval('(' + data + ')');
            var info = 'id=' + rels.id + '&username=' + rels.username + '&email=' + rels.email + '&full_name=' + rels.full_name + '&avatar=' + rels.avatar + '&checksum=' + rels.checksum;

            $.getScript(apiLiveUrl + "/ajax/dologinx.aspx?" + info);
            loginCallback = function (res) {
                if (res != 'null') {
                    if (cb != null && typeof cb === 'function') {
                        cb();
                    }
                } else {
                    alert('Bạn hãy đăng nhập lại');
                }
            };

        } else {
            alert('Bạn hãy đăng nhập lại');
        }
    };
}

function GuiTinBindData(data) {
    if (data != 'null') {
        if (window.location.href.indexOf('act=login') > 1) window.location.href = '/gui-bai-viet.chn';
        $.cookie("GTCheckLogin", true, { expires: 30, path: '/' });

        $('.user-info').find('>img').attr('src', data.avatar);
        $('.user-info').find('>p').text(data.full_name);
        $('.user-info').find('>a').attr('href', 'http://vietid.net/u/' + data.email + '/profiles');

        $('.user-info').removeClass('hidden');
        $('.user-login').remove();

        $('#input-name').val(data.full_name);
        $('#input-email').val(data.email);
        mEmail = data.email;
        $('.user-info').show();
        $('#tflogin').hide();
    } else {
        $.cookie("GTCheckLogin", false, { expires: 30, path: '/' });
        $('.user-info').hide();
        $('#tflogin').show();
        $('.user-info').remove();
    }
}
//tu tren tro len la them vao

var QuickNews = {
    totalFilesSelected: 0,
    totalFilesUploaded: 0,
    options: {
        maxFileSize: 2097152,
        maxFile: 20,
        quicknewsHandler: '/GuiTin/QuickNewsHandler.ashx',
        captchaHandler: '/GuiTin/CaptchaImage.ashx',
        uploadHandler: '/GuiTin/UploadHandler.ashx',
        profileHandlerUrl: '/Handlers/Profile/ProfileHandler.ashx'
    },
    inputFile: [],
    initQuickUpload: function (options) {
        var self = this;

        self.totalFilesSelected = 0;
        self.totalFilesUploaded = 0;

        if (options != undefined && options != null) {
            $.extend(true, self.options, options);
        }

        $("#inputFiles").on("change", function () {
            if (self._validateFileSelect(this)) {
                $("#selectfilecontainer").hide();
                $("#uploadedfilecontainer").show();

                var oFiles = this.files, len = oFiles.length;
                self.totalFilesSelected += len;
                //upload file
                for (var i = 0; i < len; i++) {
                    var rd = new Date().getTime() + i;
                    self._uploadFile(oFiles[i], true, rd);
                }
            }
        });

        $("#addMoreFiles").on("change", function () {
            if (self._validateFileSelect(this)) {
                var oFiles = this.files, len = oFiles.length;
                self.totalFilesSelected += len;
                //upload file
                for (var i = 0; i < len; i++) {
                    var rd = new Date().getTime() + 1;
                    self._uploadFile(oFiles[i], true, rd);
                }
            }
        });

        $("#btn_SendQuickNews").on("click", function () {
            self.insertQuickNews();
        });

        $("#btnRefreshCaptcha").on("click", function () {
            $('#imgcaptcha').attr('src', self.options.captchaHandler + '?rs=' + Math.random());
        });

        $("#input-content").keyup(function (e) {
            while ($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
                $(this).height($(this).height() + 1);
            };
        });
    },

    initFullUpload: function (options) {
        var self = this;

        self.totalFilesSelected = 0;
        self.totalFilesUploaded = 0;

        if (options != undefined && options != null) {
            $.extend(true, self.options, options);
        }

        $("#inputFiles").on("change", function () {
            if (self._validateFileSelect(this)) {
                $("#selectfilecontainer").hide();
                $("#uploadedfilecontainer").show();

                var oFiles = this.files, len = oFiles.length;
                self.totalFilesSelected += len;
                //upload file
                for (var i = 0; i < len; i++) {
                    var rd = new Date().getTime();
                    self._uploadFile(oFiles[i], false, rd);
                }
            }
        });

        $("#addMoreFiles").on("change", function () {
            if (self._validateFileSelect(this)) {
                var oFiles = this.files, len = oFiles.length;
                self.totalFilesSelected += len;
                //upload file
                for (var i = 0; i < len; i++) {
                    var rd = new Date().getTime();
                    self._uploadFile(oFiles[i], false, rd);
                }
            }
        });

        $("#uploadavatar").on("change", function () {
            self._onUploadAvatar(this);
        });

        $("#dropdown-cate").find("li").unbind("click").bind("click", function () {
            $("#input-category").val(this.getAttribute("value"));
            $("#selected-catename").text($(this).text());
        });

        $("#btn_SendNews").on("click", function () {

            self.sendNews();
        });

        $("#btn_Cancel").on("click", function () {
            self._clearFullForm();
        });

        $("#btn_Preview").on("click", function () {
            self.Preview();
        });

        /*setup editor*/
        var config = {
            height: 500,
            language: 'vi',
            enterMode: CKEDITOR.ENTER_P,
            toolbar: [
	            { name: 'document', items: ['Source'] },
	            { name: 'clipboard', items: ['vcphotomanager', '-', 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
	            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
	            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
	            { name: 'links', items: ['Link', 'Unlink'] },
	            { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
	            { name: 'colors', items: ['TextColor', 'BGColor'] }
            ]
        };
        CKEDITOR.replace('input-content', config);

    },

    _validateFileSelect: function (filecontrol) {
        var self = this;

        /*get selected file element*/
        var oFiles = $(filecontrol)[0].files, len = oFiles.length;
        //alert(oFiles[0].size + '-->' + self.options.maxFileSize);
        if (len > 0) {

            //validate foreach file
            for (var i = 0; i < len; i++) {
                var oFile = oFiles[i], maxsize = self.options.maxFileSize;

                if ((/video/i).test(oFile.type)) {
                    //  maxsize = 100 * 1048576; /*100Mb*/
                }

                /*//filter for image files*/
                var rFilter = /^(image\/JPG|image\/jpg|image\/jpeg|image\/png|image\/JPEG|image\/PNG|image\/GIF|image\/gif|video\/mp4|video\/flv)$/i;
                if (!rFilter.test(oFile.type)) {
                    alert('File ' + oFile.name + ' sai định dạng .jpg, .jpeg, .gif, .png, .mp4, .flv');
                    return false;
                }

                if (self.IsUnicode(oFile.name)) {
                    alert("Tên file " + oFile.name + " không hợp lệ. Tên file hợp lệ là tên chỉ chứa các chữ cái a-z, 0-9, '-', không dấu và không có ký tự đặc biệt.");
                    return false;
                }
                /*//little test for filesize*/
                if (oFile.size > maxsize) {
                    alert('File ' + oFile.name + ' có dung lượng file lớn hơn ' + (maxsize / 1048576) + 'Mb. Vui lòng resize trước khi upload.');
                    return false;
                }
            }

            return true;
        }
        else {
            return false;
        }
    },

    _uploadFile: function (file, isQuick, rd) {
        //debugger;

        var self = this, xhr, listEl = document.getElementById('file-list');
        var li = document.createElement("li"),
            progressBarContainer = document.createElement("p"),
			progressBar = document.createElement("span");
        img = document.createElement("img"),
            overlay = document.createElement("span"),
            closeBtn = document.createElement("a");

        var isVideo = (/video/i).test(file.type);

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        var tSrc = '';
        /*
        If the file is an image and the web browser supports FileReader,
        present a preview in the file list
        */
        if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
            var reader = new FileReader();

            reader.onload = (function (theImg) {
                return function (evt) {
                    theImg.src = evt.target.result;
                    tSrc = evt.target.result;
                };
            } (img));
            reader.readAsDataURL(file);
        }

        closeBtn.className = "ionexit fl";
        closeBtn.setAttribute("title", "xóa");
        closeBtn.onclick = function () {
            if (li.className == 'loadingfile') {
                /*edit*/
                var fileName = $(li).attr('data-name');
                
                var ary = self.inputFile;
                for (var i in ary) {
                    if (ary[i].Name == fileName) {
                        ary.splice(i, 1);
                        break;
                    }
                }
                /*edit*/

                xhr.abort();
                listEl.removeChild(li);
            }
            else if (li.className == 'uploaded') {
                self.deleteFile(li.getAttribute('data'), li.getAttribute('data-type'), function () {
                    listEl.removeChild(li);
                });
            }
            else {
                listEl.removeChild(li);
            }
        };

        overlay.className = "color-overlay";
        li.className = 'loadingfile';
        li.appendChild(img);
        li.appendChild(overlay);
        li.appendChild(closeBtn);
        progressBarContainer.appendChild(progressBar);
        //li.appendChild(progressBarContainer);
        progressBar.className = 'lineHeight22';

        /*edit*/
        li.setAttribute('data-type', '0');
        li.setAttribute('data-name', file.name);
        /*radio choose avatar*/
        var _newspan = document.createElement("span")
        , _newRadio = document.createElement("input")
        , _label = document.createElement("label");

        _newspan.className = "selectavatar";
        _newRadio.className = "custom-radio";
        _newRadio.type = "radio";
        _newRadio.id = rd;
        _newRadio.name = "IsAvatar";
        _label.setAttribute("for", rd);
        _label.className = "radio-label";
        _label.innerHTML = "Là avatar bài viết";

        _newspan.appendChild(_newRadio);
        _newspan.appendChild(_label);
        li.appendChild(_newspan);

        listEl.insertBefore(li, listEl.lastElementChild);
        self.inputFile.push({ File: file, Name: file.name });

        return;
        /*edit*/

        // Update progress bar
        xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var percent = (evt.loaded / evt.total) * 100;
                progressBar.style.width = percent + "%";
                if (percent == 100 && isVideo) {
                    progressBar.innerHTML = "Đang xử lý video...";
                }
            }
            else {
                // No data to calculate on
            }
        }, false);

        // File uploaded
        xhr.addEventListener("load", function (evt) {
            if (li.className != "error") {
                li.className = "uploaded";
                li.removeChild(progressBarContainer);
            }
        }, false);

        xhr.addEventListener("error", function () {
            li.className = "error";
            progressBar.innerHTML = "Error";
            self.totalFilesUploaded += 1;
        }, false);
        xhr.addEventListener("abort", function () {
            li.className = "error";
            progressBar.innerHTML = "Aborted!";
            self.totalFilesUploaded += 1;
        }, false);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var resData = xhr.responseText;
                if (typeof resData == 'string')
                    resData = JSON.parse(resData);
                if (resData.Success) {
                    if (isVideo) {
                        var vData = resData.Data, delayTime = null;
                        if (typeof vData == 'string')
                            vData = JSON.parse(vData);
                        var thumb = vData.thumb_url;
                        if (thumb == undefined || thumb == "") {
                            thumb = "http://video-thumbs.vcmedia.vn/" + vData.filename.replace(".mp4", ".jpg");
                        }

                        img.onload = function () {
                            if (img.width == 0 && img.height == 0) {
                                img.setAttribute("src", thumb + '?' + new Date().getTime());
                            }
                            if (delayTime != null) {
                                clearTimeout(delayTime);
                            }
                        };
                        img.onerror = function () {
                            /*video thumb generate delay*/
                            if (delayTime != null) {
                                clearTimeout(delayTime);
                            }
                            delayTime = setTimeout(function () {
                                img.setAttribute("src", thumb + '?' + new Date().getTime());
                            }, 1000);
                        };

                        img.setAttribute("src", thumb);
                        li.setAttribute("avatar", thumb);
                        var playIcon = document.createElement("span");
                        playIcon.className = "icon-play";
                        li.appendChild(playIcon);

                        li.setAttribute('data', vData.filename);
                        li.setAttribute('data-type', '1');
                    }
                    else {
                        li.setAttribute('data', resData.Data);
                        li.setAttribute('data-type', '0');

                        if (isQuick) {
                            /*radio choose avatar*/
                            var _rd = new Date().getTime(), _newspan = document.createElement("span"), _newRadio = document.createElement("input"), _label = document.createElement("label");
                            _newspan.className = "selectavatar";
                            _newRadio.className = "custom-radio";
                            _newRadio.type = "radio";
                            _newRadio.id = _rd;
                            _newRadio.name = "IsAvatar";
                            _label.setAttribute("for", _rd);
                            _label.className = "radio-label";
                            _label.innerHTML = "Là avatar bài viết";

                            _newspan.appendChild(_newRadio);
                            _newspan.appendChild(_label);
                            li.appendChild(_newspan);
                        }
                    }

                    if (!isQuick) {
                        var inputDes = document.createElement('input');
                        inputDes.className = "description";
                        if (isVideo) {
                            inputDes.setAttribute('placeholder', "Mô tả video...");
                        }
                        else {
                            inputDes.setAttribute('placeholder', "Mô tả ảnh...");
                        }
                        li.appendChild(inputDes);
                    }
                }
                else {
                    li.className = "error";
                    progressBar.innerHTML = resData.Message;
                }
                self.totalFilesUploaded += 1;
            }
            else if (xhr.status == 404) {
                li.className = "error";
                progressBar.innerHTML = xhr.status;
                self.totalFilesUploaded += 1;
            }
        };

        if (typeof xhr.withCredentials != 'undefined')
            xhr.withCredentials = true;

        if (isVideo) {
            xhr.open("POST", self.options.uploadHandler + '?command=uploadvideo&vietId=' + vietID);
        }
        else {
            xhr.open("POST", self.options.uploadHandler + '?command=uploadimage&vietId=' + vietID);
            ///alert(self.options.uploadHandler + '?command=uploadimage&vietId=' + vietID);
        }

        // Set appropriate headers
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.setRequestHeader("X-File-Name", file.name);
        xhr.setRequestHeader("X-File-Size", file.size);
        xhr.setRequestHeader("X-File-Type", file.type);

        // Send the file (doh)
        xhr.send(file);

        if (isQuick) {
            listEl.insertBefore(li, listEl.lastElementChild);
        }
        else {
            listEl.appendChild(li);
        }
    },
    /*edit*/
    insertQuickNews: function() {
        var self = this;

        var content = $('#input-content').val(),
            title = $('#input-title').val(),
            name = $('#input-name').val(),
            phonenumber = $('#input-phonenumber').val(),
            email = $('#input-email').val(),
            code = $('#txtCaptcha').val();
        var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if (title == undefined || title == null || $.trim(title).length == 0) {
            self._showAlertPopup('Bạn chưa nhập tiêu đề.');
            $('#input-title').focus();
            return false;
        }

        if (content == undefined || content == null || $.trim(content).length == 0) {
            self._showAlertPopup('Bạn chưa nhập nội dung.');
            $('#input-content').focus();
            return false;
        }

        if (name == undefined || name == null || $.trim(name).length == 0) {
            self._showAlertPopup('Bạn chưa nhập tên của bạn.');
            $('#input-name').focus();
            return false;
        }

        if (phonenumber == undefined || phonenumber == null || $.trim(phonenumber).length == 0) {
            self._showAlertPopup('Bạn chưa nhập số điện thoại.');
            $('#input-phonenumber').focus();
            return false;
        }

        if (email == undefined || email == null || $.trim(email).length == 0) {
            self._showAlertPopup('Bạn chưa nhập địa chỉ email.');
            $('#input-email').focus();
            return false;
        }

        if (!reg.test(email)) {
            self._showAlertPopup('Địa chỉ email không hợp lệ.');
            $('#input-email').focus();
            return false;
        }

        if (code == undefined || code == null || $.trim(code).length == 0) {
            self._showAlertPopup('Bạn chưa nhập mã xác nhận.');
            $('#txtCaptcha').focus();
            return false;
        }

        var listImgs = [];

//        $("#file-list li:not('#upload_more')").each(function (index, item) {
//            var desItem = $(item).find(".description"), isAvatar = "0", chkAvatar = $(item).find("input[name='IsAvatar']");
//            if (chkAvatar.length > 0 && chkAvatar[0].checked) {
//                isAvatar = "1";
//            }

//            for (var j = 0; j < arr.length; j++) {
//                
//            }
//        });

        var inputFiles = self.inputFile;
        var data = new FormData();
        for (var i = 0; i < inputFiles.length; i++) {
            data.append(i, inputFiles[i].File);

            var $li = $("#file-list li:not('#upload_more')").eq(i);
            var isAvatar = "0";
            var chkAvatar = $li.find("input[name='IsAvatar']");
            if (chkAvatar.length > 0 && chkAvatar[0].checked) {
                isAvatar = "1";
            }
            var type = $li.attr('data-type');
            
            listImgs.push({ Link: '', IsAvatar: isAvatar, Description: '', Type: type });
        }

        data.append('command', 'sendnews');
        data.append('title', title);
        data.append('fullname', name);
        data.append('phonenumber', phonenumber);
        data.append('content', content);
        data.append('link', $('#input-link').val());
        data.append('captchaCode', code);
        data.append('images', JSON.stringify(listImgs));

        $.ajax({
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: data,
            //url: self.options.uploadHandler + '?command=postfile&captchaCode=' + code,
            url: self.options.uploadHandler,
            cache: false,
            contentType: false,
            processData: false,
            success: function (msg) {
                if (typeof msg == 'string')
                    msg = JSON.parse(msg);

                if (msg.Success) {
                    self._showSuccessPopup('Tin của bạn đã được gửi thành công và đang chờ duyệt. Chúng tôi sẽ gửi phản hồi cho bạn trong thời gian sớm nhất.', 'Gửi thêm tin', function () {
                        // window.reload();
                    });
                    self._clearQuickForm();
                } else {
                    if (msg.ErrorCode === 404) {
                        $('#imgcaptcha').attr('src', self.options.captchaHandler + '?rs=' + Math.random());
                        self._showAlertPopup('Mã xác nhận không đúng. Vui lòng nhập lại.');
                    }
                    else {
                        self._showAlertPopup(msg.Message);
                    }
                }
            }
        });
    },
    /*edit*/
    deleteFile: function (filePath, fileType, callback) {
        return false;

        var self = this;

        $.ajax({
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            url: self.options.uploadHandler,
            data: { command: "deletefile", file: filePath, type: fileType },
            success: function (data, textStatus, jqXHR) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.Success) {
                    if (callback != undefined && callback != null && typeof callback == 'function')
                        callback();

                } else {
                    self._showAlertPopup(data.Message);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                self._showAlertPopup('Lỗi kết nối ' + textStatus);
            }
        });
    },

    _clearFileInput: function (filecontrol, isQuick) {

        if ($(filecontrol).length > 0) {
            var self = this;
            var oldInput = $(filecontrol)[0];
            var newInput = document.createElement("input");

            newInput.type = "file";
            newInput.id = oldInput.id;
            newInput.name = oldInput.name;
            newInput.className = oldInput.className;
            newInput.style.cssText = oldInput.style.cssText;
            newInput.setAttribute("multiple", "multiple");
            /*newInput.setAttribute("accept", "image/*");*/
            /*copy any other relevant attributes*/

            oldInput.parentNode.replaceChild(newInput, oldInput);

            $(filecontrol).on("change", function () {
                if (self._validateFileSelect(this)) {
                    $("#selectfilecontainer").hide();
                    $("#uploadedfilecontainer").show();

                    var oFiles = this.files, len = oFiles.length;
                    //upload file
                    for (var i = 0; i < len; i++) {
                        self._uploadFile(oFiles[i], isQuick);
                    }
                }
            });
        }
    },

    sendQuickNews: function () {
        return false;

        var self = this;

        var content = $('#input-content').val(),
            title = $('#input-title').val(),
            name = $('#input-name').val(),
            phonenumber = $('#input-phonenumber').val(),
            email = $('#input-email').val(),
            code = $('#txtCaptcha').val();
        var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if (title == undefined || title == null || $.trim(title).length == 0) {
            self._showAlertPopup('Bạn chưa nhập tiêu đề.');
            $('#input-title').focus();
            return false;
        }

        if (content == undefined || content == null || $.trim(content).length == 0) {
            self._showAlertPopup('Bạn chưa nhập nội dung.');
            $('#input-content').focus();
            return false;
        }

        if (name == undefined || name == null || $.trim(name).length == 0) {
            self._showAlertPopup('Bạn chưa nhập tên của bạn.');
            $('#input-name').focus();
            return false;
        }

        if (phonenumber == undefined || phonenumber == null || $.trim(phonenumber).length == 0) {
            self._showAlertPopup('Bạn chưa nhập số điện thoại.');
            $('#input-phonenumber').focus();
            return false;
        }

        if (email == undefined || email == null || $.trim(email).length == 0) {
            self._showAlertPopup('Bạn chưa nhập địa chỉ email.');
            $('#input-email').focus();
            return false;
        }

        if (!reg.test(email)) {
            self._showAlertPopup('Địa chỉ email không hợp lệ.');
            $('#input-email').focus();
            return false;
        }

        if (code == undefined || code == null || $.trim(code).length == 0) {
            self._showAlertPopup('Bạn chưa nhập mã xác nhận.');
            $('#txtCaptcha').focus();
            return false;
        }

        if (self.totalFilesUploaded < self.totalFilesSelected) {
            self._showAlertPopup('Bạn phải chờ upload xong mới được gửi tin.');
            return false;
        }

        var listImgs = [];

        $("#file-list").find(".uploaded").each(function (index, item) {
            if (typeof item.attributes['data'] != 'undefined' && item.attributes['data'] != null) {
                var isAvatar = "0", chkAvatar = $(item).find("input[name='IsAvatar']");
                if (chkAvatar.length > 0 && chkAvatar[0].checked) {
                    isAvatar = "1";
                }
                listImgs.push({ Link: item.attributes['data'].value, IsAvatar: isAvatar, Description: "", Type: item.attributes['data-type'] ? item.attributes['data-type'].value : "0" });
            }
        });

        $.ajax({
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            url: self.options.quicknewsHandler,
            data: {
                command: "sendnews",
                title: title,
                fullname: name,
                phonenumber: phonenumber,
                content: content,
                link: $('#input-link').val(),
                email: email,
                images: JSON.stringify(listImgs),
                captchaCode: code
            },
            success: function (data, textStatus, jqXHR) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.Success) {
                    self._showSuccessPopup('Tin của bạn đã được gửi thành công và đang chờ duyệt. Chúng tôi sẽ gửi phản hồi cho bạn trong thời gian sớm nhất.', 'Gửi thêm tin', function () {
                        // window.reload();
                    });
                    self._clearQuickForm();
                } else {
                    if (data.ErrorCode == 404) {
                        /*captchar Session time out*/
                        $('#imgcaptcha').attr('src', self.options.captchaHandler + '?rs=' + Math.random());
                        self._showAlertPopup('Mã xác nhận không đúng. Vui lòng nhập lại.');
                    }
                    else {
                        self._showAlertPopup(data.Message);
                    }
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Lỗi kết nối ' + textStatus);
            }
        });
    },

    _clearQuickForm: function () {
        var self = this;

        $('#input-content').val('');
        $('#input-title').val('');
        $('#input-name').val('');
        $('#input-phonenumber').val('');
        $('#input-link').val('');
        $('#input-email').val('');
        $('#txtCaptcha').val('');
        $('#imgcaptcha').attr('src', self.options.captchaHandler + '?command=createcaptcha&rs=' + Math.random());

        self._clearFileInput("#inputFiles", true);
        self._clearFileInput("#addMoreFiles", true);

        $("#selectfilecontainer").show();
        $("#uploadedfilecontainer").hide();

        var html = $("#file-list").find("#upload_more").clone().wrap('<p>').parent().html();
        $("#file-list").html(html);

    },

    sendNews: function () {
        return false;

        var self = this, content = CKEDITOR.instances['input-content'].getData(),
            title = $('#input-title').val(),
            category = $("#input-category").val(),
            phonenumber = $('#input-phonenumber').val(),
            location = ""/*$('#input-location').val()*/,
            job = $('#input-job').val(),
            sapo = $('#input-sapo').val(),
            penname = $('#input-penname').val(),
            note = $('#input-note').val();

        if (content == null || content == "") {
            content = $('#input-content').val();
        }

        if (title == undefined || title == null || $.trim(title).length == 0) {
            self._showAlertPopup('Bạn chưa nhập tiêu đề.');
            $('#input-title').focus();
            return false;
        }

        if (category == undefined || category == null || $.trim(category).length == 0 || category == "0") {
            self._showAlertPopup('Bạn chưa chọn chuyên mục.');
            return false;
        }

        if (content == undefined || content == null || $.trim(content).length == 0) {
            self._showAlertPopup('Bạn chưa nhập nội dung.');
            return false;
        }

        if (self.totalFilesUploaded < self.totalFilesSelected) {
            self._showAlertPopup('Bạn phải chờ upload xong mới được gửi tin.');
            return false;
        }


        var listImgs = [];
        var inputFile = self.inputFile;

        $("#file-list").find(".uploaded").each(function (index, item) {
            if (typeof item.attributes['data'] != 'undefined' && item.attributes['data'] != null) {
                var desItem = $(item).find(".description"), isAvatar = "0", chkAvatar = $(item).find("input[name='IsAvatar']");
                if (chkAvatar.length > 0 && chkAvatar[0].checked) {
                    isAvatar = "1";
                }

                if (desItem.length > 0) {
                    listImgs.push({ Link: item.attributes['data'].value, IsAvatar: isAvatar, Description: desItem.val(), Type: item.attributes['data-type'] ? item.attributes['data-type'].value : "0" });
                }
                else {
                    listImgs.push({ Link: item.attributes['data'].value, IsAvatar: isAvatar, Description: '', Type: item.attributes['data-type'] ? item.attributes['data-type'].value : "0" });
                }
            }
        });

        if ($("#img-avatar").length > 0) {
            var _avatar = $("#img-avatar").attr('data');
            if (typeof _avatar != 'undefined' && _avatar != null) {
                listImgs.push({ Link: _avatar, IsAvatar: "1", Description: "", Type: "0" });
            }
        }

        content = encodeURIComponent(content); /*encode script*/

        $.ajax({
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            url: self.options.quicknewsHandler,
            data: {
                command: "sendnews",
                title: title,
                cateId: category,
                phonenumber: phonenumber,
                sapo: sapo,
                content: content,
                note: note,
                fullname: $('#hd-fullname').val(),
                location: location,
                penname: penname,
                job: job,
                avatar: $('#hd-avatar').val(),
                images: JSON.stringify(listImgs)
            },
            success: function (data, textStatus, jqXHR) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.Success) {
                    self._showSuccessPopup('Bài viết của bạn đã được gửi thành công và đang chờ duyệt. Chúng tôi sẽ gửi phản hồi cho bạn trong thời gian sớm nhất.', 'Gửi thêm bài', function () {
                        window.reload();
                    });
                    self._clearFullForm();
                } else {
                    if (data.Type == 1486) {
                        /*Session time out*/
                        dologinx();
                    }
                    self._showAlertPopup(data.Message);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                self._showAlertPopup('Lỗi kết nối ' + textStatus);
            }
        });
    },

    _clearFullForm: function () {
        var self = this;

        $('#input-content').val('');
        $('#input-title').val('');
        $('#input-sapo').val('');
        $('#input-category').val('');
        $('#selected-catename').text('Chọn chuyên mục');
        $('#input-note').val('');
        CKEDITOR.instances['input-content'].setData('');

        self._clearFileInput("#inputFiles", false);
        self._clearFileInput("#addMoreFiles", false);

        $("#selectfilecontainer").show();
        $("#uploadedfilecontainer").hide();
        $("#file-list").html('');

        /*upload avatar*/
        if ($("#UploadAvatarContainer").find(".color-overlay").length > 0)
            $("#UploadAvatarContainer").find(".color-overlay").remove();
        if ($("#UploadAvatarContainer").find("#img-avatar").length > 0)
            $("#UploadAvatarContainer").find("#img-avatar").remove();

        $("#uploadavatar_btn").show();
        $("#uploadavatar").css({ width: 160, height: 40 });
    },

    IsUnicode: function (str) {
        var pattern = /[^\u0000-\u0080]+/;
        return pattern.test(str);
    },

    Preview: function () {
        var self = this,
            content = CKEDITOR.instances['input-content'].getData(),
            title = $('#input-title').val(),
            category = $("#input-category").val(),
            sapo = $('#input-sapo').val(),
            cateName = $("#selected-catename").text(),
            authorName = $('#hd-fullname').val(),
            authorAvatar = $('#hd-avatar').val(),
            authorJob = $('#input-job').val(),
            penname = $('#input-penname').val();

        if (content == null || content == "") {
            content = $('#input-content').val();
        }

        if (title == undefined || title == null || $.trim(title).length == 0) {
            self._showAlertPopup('Bạn chưa nhập tiêu đề bài viết.');
            $('#input-title').focus();
            return false;
        }

        if (category == undefined || category == null || $.trim(category).length == 0 || category == "0") {
            self._showAlertPopup('Bạn chưa chọn chuyên mục cho bài viết.');
            return false;
        }

        if (content == undefined || content == null || $.trim(content).length == 0) {
            self._showAlertPopup('Bạn chưa nhập nội dung bài viết.');
            return false;
        }

        var avatarImg = '';
        if ($("#img-avatar").length > 0) {
            var _avatar = $("#img-avatar").attr('data');
            if (_avatar) {
                avatarImg = '<img src="' + vcImageHost + '/zoom/660_360' + _avatar + '" alt="" />';
            }
        }

        //        if (sapo != null && $.trim(sapo).length > 0)
        //            sapo = '(autopro.com.vn) - ' + sapo;

        if (penname != null && $.trim(penname).length > 0)
            authorName = penname;
        var docW = $(document).width(), docH = $(document).height(), zindex = 9999, bodyEl = $("body"), popupW = 716, popupH = window.innerHeight;
        var overlay = $("<div />").addClass("overlay").css({ "width": docW, "height": docH, "zIndex": zindex }).appendTo(bodyEl);
        var previewBox = $("<div />").addClass("previewbox").css({ "width": popupW, "height": popupH, "zIndex": (zindex + 1), "left": (docW - popupW) / 2 }).appendTo(bodyEl);
        var previewHeader = $("<div />").addClass("previewboxheader").html("Xem trước").appendTo(previewBox);
        var closeBtn = $("<span />").addClass("close-button").appendTo(previewHeader);
        var previewContainer = $("<div />").addClass("previewboxcontainer").css({ "width": popupW, "height": (popupH - 50) }).appendTo(previewBox);
        var dateNow = new Date();
        var html = '<div style="margin:10px auto;width:660px;">' +
                        '<div class="postpadding">' +
        /*'<div class="breadcrumb">' +
        '<a href="javascript:void(0)" class="breadcrumbitem">' + cateName + '</a>' +
        '</div>' +*/
                            '<h1 class="news-title mgt17">' + title + '</h1>' +
                            '<div class="news-info mgt8 clearfix">' +
                                '<span class="time">' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + dateNow.getSeconds() + ' </span>' +
                                '<span class="date">' + dateNow.getDate() + '/' + (dateNow.getMonth() + 1) + '/' + dateNow.getFullYear() + '</span>' +
                            '</div>' +
                            '<div class="share mgt15 details_top_like clearfix">' +
                                '<div class="quicknews-author"><a href="javascript:void(0)"><img src="' + authorAvatar + '" alt="avatar"></a><a href="javascript:void(0)"><p class="name">' + authorName + '</p></a></div>' +
                                '<div style="width:45px;float:left">' +
                                    '<img src="http://kenh143.vcmedia.vn/skin/guitin/likesharebt.jpg">' +
                                '</div>' +
                            '</div>' + avatarImg +
                            '<h2 class="news-sapo mgt15">' + sapo + '</h2>' +
                            '<div class="news-content">' + content + '</div>' +
                            '<div class="quicknews-authorpostbt">' +
                                '<a href="javascript:void(0)"><img src="' + authorAvatar + '" alt="avatar"></a>' +
                                '<p>Bài viết bởi độc giả</p>' +
                                '<p class="name"><a href="javascript:void(0)">' + authorName + '</a></p> ' +
                                '<p class="job">' + authorJob + '</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="clearfix"> </div>' +
                    '</div>';

        previewContainer.html(html);

        overlay.bind("click", function () {
            overlay.fadeOut(800);
            previewBox.fadeOut(800, function () {
                previewBox.remove();
                overlay.remove();
            });
        });

        closeBtn.bind("click", function () {
            overlay.fadeOut(800);
            previewBox.fadeOut(800, function () {
                previewBox.remove();
                overlay.remove();
            });
        });

        return false;

    },

    _onUploadAvatar: function (inputFile) {
        var self = this;

        /*get selected file element*/
        var oFiles = $(inputFile)[0].files;
        if (oFiles.length > 0) {
            var oFile = oFiles[0];
            //  alert(oFile.size + '-->' + self.options.maxFileSize);
            /*//filter for image files*/
            var rFilter = /^(image\/JPG|image\/jpg|image\/jpeg|image\/png|image\/JPEG|image\/PNG|image\/GIF|image\/gif)$/i;
            if (!rFilter.test(oFile.type)) {
                alert('File ' + oFile.name + ' sai định dạng .jpg, .jpeg, .png, .gif');
                return false;
            }

            if (self.IsUnicode(oFile.name)) {
                alert("Tên file " + oFile.name + " không hợp lệ. Tên file hợp lệ là tên chỉ chứa các chữ cái a-z, 0-9, '-', không dấu và không có ký tự đặc biệt.");
                return false;
            }
            /*//little test for filesize*/
            if (oFile.size > self.options.maxFileSize) {
                alert('File ' + oFile.name + ' có dung lượng file lớn hơn ' + (self.options.maxFileSize / 1048576) + 'Mb. Vui lòng resize trước khi upload.');
                return false;
            }

            /*upload image*/
            var xhr, img = document.getElementById('img-avatar'), container = document.getElementById("UploadAvatarContainer");
            if (img == undefined || img == null) {
                img = document.createElement("img");
                img.id = "img-avatar";
                container.appendChild(img);
            }

            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xhr = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            /*
            If the file is an image and the web browser supports FileReader,
            present a preview in the file list
            */
            if (typeof FileReader !== "undefined" && (/image/i).test(oFile.type)) {
                var reader = new FileReader();
                reader.onload = (function (theImg) {
                    return function (evt) {
                        theImg.src = evt.target.result;
                    };
                } (img));
                reader.readAsDataURL(oFile);
            }

            $(inputFile).hide();
            $("#uploadavatar_btn").hide();

            xhr.addEventListener("error", function () {
                self._showAlertPopup('Xảy ra lỗi khi upload avatar');
            }, false);
            xhr.addEventListener("abort", function () {
                console.log('Abort');
            }, false);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var resData = xhr.responseText;
                    if (typeof resData == 'string')
                        resData = JSON.parse(resData);
                    if (resData.Success) {
                        img.setAttribute('data', resData.Data);

                        var overlay = container.getElementsByTagName("span");
                        if (overlay.length == 0) {
                            overlay = document.createElement("span");
                            overlay.className = "color-overlay";
                            overlay.innerHTML = 'Đổi ảnh';
                            container.appendChild(overlay);
                        }
                        $(inputFile).css({ width: 80, height: 80 }).show();
                    }
                    else {
                        self._showAlertPopup(resData.Message);
                    }
                }
            };

            if (typeof xhr.withCredentials != 'undefined')
                xhr.withCredentials = true;

            xhr.open("POST", self.options.uploadHandler + '?command=uploadimage&vietId=' + vietID);

            // Set appropriate headers
            xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.setRequestHeader("X-File-Name", oFile.name);
            xhr.setRequestHeader("X-File-Size", oFile.size);
            xhr.setRequestHeader("X-File-Type", oFile.type);

            // Send the file (doh)
            xhr.send(oFile);
        }
    },

    _showAlertPopup: function (message) {
        var d = new Date(),
        n = d.getTime(),
        temp = '<div id="alert-overlay-' + n + '" class="alert-overlay"></div>' +
                '<div id="alert-' + n + '" class="alert-popup">' +
                    '<div class="alert-header">' +
                        '<div>' + message + '</div>' +
                        '<span id="close-btn-' + n + '" class="close-btn"></span>' +
                    '</div>' +
                    '<div class="alert-footer"><input type="button" value="OK" class="accept-btn" id="accept-btn-' + n + '" /></div>' +
                '</div>';
        $("body").append(temp);

        $('#close-btn-' + n).on("click", function () {
            $('#alert-overlay-' + n).remove();
            $('#alert-' + n).remove();
        });

        $('#accept-btn-' + n).on("click", function () {
            $('#alert-overlay-' + n).remove();
            $('#alert-' + n).remove();
        });
    },

    _showSuccessPopup: function (message, acceptButtonText, acceptFunction) {
        if (acceptButtonText == null || acceptButtonText.length == 0)
            acceptButtonText = 'OK';

        var d = new Date(),
        n = d.getTime(),
        temp = '<div id="alert-overlay-' + n + '" class="alert-overlay"></div>' +
            '<div id="success-popup-' + n + '" class="alert-popup">' +
                '<div class="success-header">' +
                    '<div class="message">' + message + '</div>' +
                    '<span id="close-btn-' + n + '" class="close-btn"></span>' +
                '</div>' +
                '<div class="alert-footer"><input type="button" value="' + acceptButtonText + '" class="accept-btn" id="accept-btn-' + n + '" /></div>' +
            '</div>';
        $("body").append(temp);

        $('#close-btn-' + n).on("click", function () {
            $('#alert-overlay-' + n).remove();
            $('#success-popup-' + n).remove();
        });

        $('#accept-btn-' + n).on("click", function () {
            $('#alert-overlay-' + n).remove();
            $('#success-popup-' + n).remove();
            if (typeof acceptFunction == 'function') {
                acceptFunction();
            }
        });
    },

    setLoginData: function (userData) {
        var self = this;

        var strQuery = "username=" + userData.username + "&email=" + userData.email + "&full_name=" + userData.full_name + "&id=" + userData.id + "&checksum=" + userData.checksum + "&avatar=" + userData.avatar;
        $.getScript(ajaxDomain + "/Handlers/Ajax/dologinx.aspx?" + strQuery);
        loginCallback = function (data) {
            if (data != null) {
                $("#idNameMing").html(data.username);
                $("#divLoginInfo").show();
                $("#divLogin").hide();
                removeSignOutVietIdStatus();
                reloadIFrame();
                isloggedin = true;
                $(document).trigger("done-login");
                GuiTinBindData(data);
                // $.getScript(ajaxDomainGt + "/Handlers/dologin.aspx?" + strQuery);
            }
            else {
                self._showAlertPopup('Đăng nhập không thành công. Vui lòng kiểm tra lại email hoặc mật khẩu.');
                $("#divLoginInfo").hide();
                $("#divLogin").show();
                isloggedin = false;
                $(document).trigger("done-login");
                GuiTinBindData(data);
            }
        };
    }
};


function loginVietID(formEl) {
    if (typeof formEl == 'string' && formEl.indexOf('.') != 0 && formEl.indexOf('#') != 0)
        formEl = '#' + formEl;

    var userName = $(formEl).find('input[name="username"]').val(), password = $(formEl).find('input[name="password"]').val();
    if (userName == undefined || userName == null || $.trim(userName).length == 0) {
        QuickNews._showAlertPopup('Bạn chưa nhập tên đăng nhập.');
        return false;
    }

    if (password == undefined || password == null || $.trim(password).length == 0) {
        QuickNews._showAlertPopup('Bạn chưa nhập mật khẩu.');
        return false;
    }

    var remember = $(formEl).find("input[name='remember']")[0].checked;

    var link = "http://vietid.net/Login/LoginAPI?email={0}&password={1}&checksum={2}&jsoncallback=?".format(userName, Base64.encode(password), MD5(userName + 'socnhilogin2'));

    var iframe = $('<iframe src="' + link + '" style="display: none;" />').appendTo('body');
    iframe.bind('load', function () {

        $.getScript("http://vietid.net/login/Checksession");

        mingAuthCallBack = function (data) {
            if (data != 'null') {
                var rels = eval('(' + data + ')');

                QuickNews.setLoginData(rels);

                vietID = rels.id;

                if (typeof removeSignOutVietIdStatus == 'function') {
                    removeSignOutVietIdStatus();
                }

                $(document).bind("done-login", function () {
                    if (isloggedin) {
                        // window.location.href = "gui-bai-viet.chn";
                    }

                    setTimeout(function () { $(document).unbind("done-login"); }, 200);
                });

            }
            else {
                QuickNews._showAlertPopup('Đăng nhập không thành công. Vui lòng kiểm tra lại email hoặc mật khẩu.');
            }
        };

        setTimeout(function () { iframe.remove(); }, 100);
    });
}

if (!String.prototype.format) {
    String.prototype.format = function () {

        var args = arguments;
        var sprintfRegex = /\{(\d+)\}/g;

        var sprintf = function (match, number) {
            return number in args ? args[number] : match;
        };

        return this.replace(sprintfRegex, sprintf);
    };
}

/********* Base64 encode *********/
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (c) { var a = ""; var k, h, f, j, g, e, d; var b = 0; c = Base64._utf8_encode(c); while (b < c.length) { k = c.charCodeAt(b++); h = c.charCodeAt(b++); f = c.charCodeAt(b++); j = k >> 2; g = ((k & 3) << 4) | (h >> 4); e = ((h & 15) << 2) | (f >> 6); d = f & 63; if (isNaN(h)) { e = d = 64 } else { if (isNaN(f)) { d = 64 } } a = a + this._keyStr.charAt(j) + this._keyStr.charAt(g) + this._keyStr.charAt(e) + this._keyStr.charAt(d) } return a }, decode: function (c) { var a = ""; var k, h, f; var j, g, e, d; var b = 0; c = c.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (b < c.length) { j = this._keyStr.indexOf(c.charAt(b++)); g = this._keyStr.indexOf(c.charAt(b++)); e = this._keyStr.indexOf(c.charAt(b++)); d = this._keyStr.indexOf(c.charAt(b++)); k = (j << 2) | (g >> 4); h = ((g & 15) << 4) | (e >> 2); f = ((e & 3) << 6) | d; a = a + String.fromCharCode(k); if (e != 64) { a = a + String.fromCharCode(h) } if (d != 64) { a = a + String.fromCharCode(f) } } a = Base64._utf8_decode(a); return a }, _utf8_encode: function (b) { b = b.replace(/\r\n/g, "\n"); var a = ""; for (var e = 0; e < b.length; e++) { var d = b.charCodeAt(e); if (d < 128) { a += String.fromCharCode(d) } else { if ((d > 127) && (d < 2048)) { a += String.fromCharCode((d >> 6) | 192); a += String.fromCharCode((d & 63) | 128) } else { a += String.fromCharCode((d >> 12) | 224); a += String.fromCharCode(((d >> 6) & 63) | 128); a += String.fromCharCode((d & 63) | 128) } } } return a }, _utf8_decode: function (a) { var b = ""; var d = 0; var e = c1 = c2 = 0; while (d < a.length) { e = a.charCodeAt(d); if (e < 128) { b += String.fromCharCode(e); d++ } else { if ((e > 191) && (e < 224)) { c2 = a.charCodeAt(d + 1); b += String.fromCharCode(((e & 31) << 6) | (c2 & 63)); d += 2 } else { c2 = a.charCodeAt(d + 1); c3 = a.charCodeAt(d + 2); b += String.fromCharCode(((e & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); d += 3 } } } return b } };

/********* MD5 encode *********/
var MD5 = function (s) { function L(b, a) { return (b << a) | (b >>> (32 - a)) } function K(k, b) { var F, a, d, x, c; d = (k & 2147483648); x = (b & 2147483648); F = (k & 1073741824); a = (b & 1073741824); c = (k & 1073741823) + (b & 1073741823); if (F & a) { return (c ^ 2147483648 ^ d ^ x) } if (F | a) { if (c & 1073741824) { return (c ^ 3221225472 ^ d ^ x) } else { return (c ^ 1073741824 ^ d ^ x) } } else { return (c ^ d ^ x) } } function r(a, c, b) { return (a & c) | ((~a) & b) } function q(a, c, b) { return (a & b) | (c & (~b)) } function p(a, c, b) { return (a ^ c ^ b) } function n(a, c, b) { return (c ^ (a | (~b))) } function u(G, F, aa, Z, k, H, I) { G = K(G, K(K(r(F, aa, Z), k), I)); return K(L(G, H), F) } function f(G, F, aa, Z, k, H, I) { G = K(G, K(K(q(F, aa, Z), k), I)); return K(L(G, H), F) } function D(G, F, aa, Z, k, H, I) { G = K(G, K(K(p(F, aa, Z), k), I)); return K(L(G, H), F) } function t(G, F, aa, Z, k, H, I) { G = K(G, K(K(n(F, aa, Z), k), I)); return K(L(G, H), F) } function e(k) { var G; var d = k.length; var c = d + 8; var b = (c - (c % 64)) / 64; var F = (b + 1) * 16; var H = Array(F - 1); var a = 0; var x = 0; while (x < d) { G = (x - (x % 4)) / 4; a = (x % 4) * 8; H[G] = (H[G] | (k.charCodeAt(x) << a)); x++ } G = (x - (x % 4)) / 4; a = (x % 4) * 8; H[G] = H[G] | (128 << a); H[F - 2] = d << 3; H[F - 1] = d >>> 29; return H } function B(c) { var b = "", d = "", k, a; for (a = 0; a <= 3; a++) { k = (c >>> (a * 8)) & 255; d = "0" + k.toString(16); b = b + d.substr(d.length - 2, 2) } return b } function J(b) { b = b.replace(/\r\n/g, "\n"); var a = ""; for (var k = 0; k < b.length; k++) { var d = b.charCodeAt(k); if (d < 128) { a += String.fromCharCode(d) } else { if ((d > 127) && (d < 2048)) { a += String.fromCharCode((d >> 6) | 192); a += String.fromCharCode((d & 63) | 128) } else { a += String.fromCharCode((d >> 12) | 224); a += String.fromCharCode(((d >> 6) & 63) | 128); a += String.fromCharCode((d & 63) | 128) } } } return a } var C = Array(); var P, h, E, v, g, Y, X, W, V; var S = 7, Q = 12, N = 17, M = 22; var A = 5, z = 9, y = 14, w = 20; var o = 4, m = 11, l = 16, j = 23; var U = 6, T = 10, R = 15, O = 21; s = J(s); C = e(s); Y = 1732584193; X = 4023233417; W = 2562383102; V = 271733878; for (P = 0; P < C.length; P += 16) { h = Y; E = X; v = W; g = V; Y = u(Y, X, W, V, C[P + 0], S, 3614090360); V = u(V, Y, X, W, C[P + 1], Q, 3905402710); W = u(W, V, Y, X, C[P + 2], N, 606105819); X = u(X, W, V, Y, C[P + 3], M, 3250441966); Y = u(Y, X, W, V, C[P + 4], S, 4118548399); V = u(V, Y, X, W, C[P + 5], Q, 1200080426); W = u(W, V, Y, X, C[P + 6], N, 2821735955); X = u(X, W, V, Y, C[P + 7], M, 4249261313); Y = u(Y, X, W, V, C[P + 8], S, 1770035416); V = u(V, Y, X, W, C[P + 9], Q, 2336552879); W = u(W, V, Y, X, C[P + 10], N, 4294925233); X = u(X, W, V, Y, C[P + 11], M, 2304563134); Y = u(Y, X, W, V, C[P + 12], S, 1804603682); V = u(V, Y, X, W, C[P + 13], Q, 4254626195); W = u(W, V, Y, X, C[P + 14], N, 2792965006); X = u(X, W, V, Y, C[P + 15], M, 1236535329); Y = f(Y, X, W, V, C[P + 1], A, 4129170786); V = f(V, Y, X, W, C[P + 6], z, 3225465664); W = f(W, V, Y, X, C[P + 11], y, 643717713); X = f(X, W, V, Y, C[P + 0], w, 3921069994); Y = f(Y, X, W, V, C[P + 5], A, 3593408605); V = f(V, Y, X, W, C[P + 10], z, 38016083); W = f(W, V, Y, X, C[P + 15], y, 3634488961); X = f(X, W, V, Y, C[P + 4], w, 3889429448); Y = f(Y, X, W, V, C[P + 9], A, 568446438); V = f(V, Y, X, W, C[P + 14], z, 3275163606); W = f(W, V, Y, X, C[P + 3], y, 4107603335); X = f(X, W, V, Y, C[P + 8], w, 1163531501); Y = f(Y, X, W, V, C[P + 13], A, 2850285829); V = f(V, Y, X, W, C[P + 2], z, 4243563512); W = f(W, V, Y, X, C[P + 7], y, 1735328473); X = f(X, W, V, Y, C[P + 12], w, 2368359562); Y = D(Y, X, W, V, C[P + 5], o, 4294588738); V = D(V, Y, X, W, C[P + 8], m, 2272392833); W = D(W, V, Y, X, C[P + 11], l, 1839030562); X = D(X, W, V, Y, C[P + 14], j, 4259657740); Y = D(Y, X, W, V, C[P + 1], o, 2763975236); V = D(V, Y, X, W, C[P + 4], m, 1272893353); W = D(W, V, Y, X, C[P + 7], l, 4139469664); X = D(X, W, V, Y, C[P + 10], j, 3200236656); Y = D(Y, X, W, V, C[P + 13], o, 681279174); V = D(V, Y, X, W, C[P + 0], m, 3936430074); W = D(W, V, Y, X, C[P + 3], l, 3572445317); X = D(X, W, V, Y, C[P + 6], j, 76029189); Y = D(Y, X, W, V, C[P + 9], o, 3654602809); V = D(V, Y, X, W, C[P + 12], m, 3873151461); W = D(W, V, Y, X, C[P + 15], l, 530742520); X = D(X, W, V, Y, C[P + 2], j, 3299628645); Y = t(Y, X, W, V, C[P + 0], U, 4096336452); V = t(V, Y, X, W, C[P + 7], T, 1126891415); W = t(W, V, Y, X, C[P + 14], R, 2878612391); X = t(X, W, V, Y, C[P + 5], O, 4237533241); Y = t(Y, X, W, V, C[P + 12], U, 1700485571); V = t(V, Y, X, W, C[P + 3], T, 2399980690); W = t(W, V, Y, X, C[P + 10], R, 4293915773); X = t(X, W, V, Y, C[P + 1], O, 2240044497); Y = t(Y, X, W, V, C[P + 8], U, 1873313359); V = t(V, Y, X, W, C[P + 15], T, 4264355552); W = t(W, V, Y, X, C[P + 6], R, 2734768916); X = t(X, W, V, Y, C[P + 13], O, 1309151649); Y = t(Y, X, W, V, C[P + 4], U, 4149444226); V = t(V, Y, X, W, C[P + 11], T, 3174756917); W = t(W, V, Y, X, C[P + 2], R, 718787259); X = t(X, W, V, Y, C[P + 9], O, 3951481745); Y = K(Y, h); X = K(X, E); W = K(W, v); V = K(V, g) } var i = B(Y) + B(X) + B(W) + B(V); return i.toLowerCase() };

/********* json2.js *********/
if (typeof JSON !== "object") { JSON = {} } (function () { function f(n) { return n < 10 ? "0" + n : n } if (typeof Date.prototype.toJSON !== "function") { Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () { return this.valueOf() } } var cx, escapable, gap, indent, meta, rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + string + '"' } function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === "object" && typeof value.toJSON === "function") { value = value.toJSON(key) } if (typeof rep === "function") { value = rep.call(holder, key, value) } switch (typeof value) { case "string": return quote(value); case "number": return isFinite(value) ? String(value) : "null"; case "boolean": case "null": return String(value); case "object": if (!value) { return "null" } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === "[object Array]") { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || "null" } v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]"; gap = mind; return v } if (rep && typeof rep === "object") { length = rep.length; for (i = 0; i < length; i += 1) { if (typeof rep[i] === "string") { k = rep[i]; v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ": " : ":") + v) } } } } else { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ": " : ":") + v) } } } } v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}"; gap = mind; return v } } if (typeof JSON.stringify !== "function") { escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }; JSON.stringify = function (value, replacer, space) { var i; gap = ""; indent = ""; if (typeof space === "number") { for (i = 0; i < space; i += 1) { indent += " " } } else { if (typeof space === "string") { indent = space } } rep = replacer; if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) { throw new Error("JSON.stringify") } return str("", { "": value }) } } if (typeof JSON.parse !== "function") { cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; JSON.parse = function (text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === "object") { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v } else { delete value[k] } } } } return reviver.call(holder, key, value) } text = String(text); cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) { j = eval("(" + text + ")"); return typeof reviver === "function" ? walk({ "": j }, "") : j } throw new SyntaxError("JSON.parse") } } } ());